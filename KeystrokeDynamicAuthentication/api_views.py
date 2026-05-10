import json
import os

import pandas as pd
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from users.models import UserRegistrationModel
from users.utility.FARFRR_Calc import process_randomForest


@csrf_exempt
@require_http_methods(["POST"])
def api_register(request):
    """Register a new user with keystroke data."""
    try:
        data = json.loads(request.body)
        required_fields = ['name', 'loginid', 'password', 'mobile', 'email']
        for field in required_fields:
            if field not in data or not data[field]:
                return JsonResponse(
                    {'success': False, 'message': f'Missing required field: {field}'},
                    status=400,
                )

        user = UserRegistrationModel(
            name=data['name'],
            loginid=data['loginid'],
            password=data['password'],
            mobile=data['mobile'],
            email=data['email'],
            locality=data.get('locality', ''),
            address=data.get('address', ''),
            city=data.get('city', ''),
            state=data.get('state', ''),
            status='waiting',
            skda=data.get('skda', '0'),
        )
        user.save()
        return JsonResponse(
            {'success': True, 'message': 'Registration successful. Wait for admin activation.'}
        )
    except Exception as e:  # noqa: BLE001
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def api_login(request):
    """User login."""
    try:
        data = json.loads(request.body)
        loginid = data.get('loginid', '')
        password = data.get('password', '')

        if not loginid or not password:
            return JsonResponse(
                {'success': False, 'message': 'Missing loginid or password'}, status=400
            )

        user = UserRegistrationModel.objects.get(loginid=loginid, password=password)
        if user.status == 'activated':
            request.session['loginid'] = loginid
            request.session['email'] = user.email
            request.session['user_id'] = user.id
            return JsonResponse({
                'success': True,
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'loginid': user.loginid,
                    'email': user.email,
                    'mobile': user.mobile,
                    'status': user.status,
                    'skda': user.skda,
                },
            })
        return JsonResponse(
            {'success': False, 'message': 'Account not activated. Contact admin.'},
            status=403,
        )
    except UserRegistrationModel.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=401)
    except Exception as e:  # noqa: BLE001
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def api_admin_login(request):
    """Admin login."""
    try:
        data = json.loads(request.body)
        username = data.get('username', '')
        password = data.get('password', '')

        if not username or not password:
            return JsonResponse(
                {'success': False, 'message': 'Missing username or password'}, status=400
            )

        if username == 'admin' and password == 'admin':
            request.session['admin'] = True
            request.session['admin_user'] = username
            return JsonResponse({'success': True, 'role': 'admin'})
        return JsonResponse(
            {'success': False, 'message': 'Invalid admin credentials'}, status=401
        )
    except Exception as e:  # noqa: BLE001
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def api_change_password(request):
    """Change password with keystroke verification."""
    try:
        data = json.loads(request.body)
        loginid = data.get('loginid', '')
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')
        new_skda = data.get('skda', '0')

        if not loginid or not current_password or not new_password:
            return JsonResponse(
                {'success': False, 'message': 'Missing required fields'}, status=400
            )

        user = UserRegistrationModel.objects.get(loginid=loginid, password=current_password)
        stored_skda = int(user.skda)
        new_skda_val = int(new_skda)

        difference = abs(stored_skda - new_skda_val)
        if difference <= 300:
            user.password = new_password
            user.skda = new_skda
            user.save()
            return JsonResponse({
                'success': True,
                'message': 'Password changed successfully',
                'keystroke_match': True,
                'stored_skda': stored_skda,
                'new_skda': new_skda_val,
                'difference': difference,
            })
        return JsonResponse({
            'success': False,
            'message': 'Keystroke pattern mismatch. Possible unauthorized access.',
            'keystroke_match': False,
            'stored_skda': stored_skda,
            'new_skda': new_skda_val,
            'difference': difference,
            'tolerance': 300,
        }, status=403)
    except UserRegistrationModel.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=401)
    except ValueError:
        return JsonResponse({'success': False, 'message': 'Invalid SKDA values'}, status=400)
    except Exception as e:  # noqa: BLE001
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@require_http_methods(["GET"])
def api_get_users(request):
    """Get all registered users (admin)."""
    try:
        users = UserRegistrationModel.objects.all().values(
            'id', 'name', 'loginid', 'email', 'mobile',
            'locality', 'city', 'state', 'status', 'skda',
        )
        return JsonResponse({'success': True, 'users': list(users)})
    except Exception as e:  # noqa: BLE001
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def api_activate_user(request):
    """Activate a user account (admin)."""
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')

        if not user_id:
            return JsonResponse({'success': False, 'message': 'Missing user_id'}, status=400)

        user = UserRegistrationModel.objects.get(id=user_id)
        user.status = 'activated'
        user.save()
        return JsonResponse({'success': True, 'message': f'User {user.name} activated'})
    except UserRegistrationModel.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
    except Exception as e:  # noqa: BLE001
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def api_deactivate_user(request):
    """Deactivate a user account (admin)."""
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')

        if not user_id:
            return JsonResponse({'success': False, 'message': 'Missing user_id'}, status=400)

        user = UserRegistrationModel.objects.get(id=user_id)
        user.status = 'waiting'
        user.save()
        return JsonResponse({'success': True, 'message': f'User {user.name} deactivated'})
    except UserRegistrationModel.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
    except Exception as e:  # noqa: BLE001
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@require_http_methods(["GET"])
def api_get_dataset(request):
    """Get keystroke dataset."""
    try:
        csv_path = os.path.join(settings.MEDIA_ROOT, 'data.csv')
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            return JsonResponse({
                'success': True,
                'columns': list(df.columns),
                'data': df.head(100).to_dict('records'),
                'total_rows': len(df),
            })
        return JsonResponse({'success': False, 'message': 'Dataset not found'}, status=404)
    except Exception as e:  # noqa: BLE001
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@require_http_methods(["GET"])
def api_classification(request):
    """Get ML classification results."""
    try:
        rf_report, FAR, FRR, ERR = process_randomForest()

        report_dict = {}
        for key, value in rf_report.items():
            if isinstance(value, dict):
                report_dict[str(key)] = {
                    str(k): float(v) if isinstance(v, (int, float)) else v
                    for k, v in value.items()
                }
            else:
                report_dict[str(key)] = (
                    float(value) if isinstance(value, (int, float)) else value
                )

        return JsonResponse({
            'success': True,
            'classification_report': report_dict,
            'FAR': FAR,
            'FRR': FRR,
            'ERR': ERR,
        })
    except Exception as e:  # noqa: BLE001
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@require_http_methods(["GET"])
def api_dashboard_stats(request):
    """Get dashboard statistics."""
    try:
        total_users = UserRegistrationModel.objects.count()
        active_users = UserRegistrationModel.objects.filter(status='activated').count()
        pending_users = UserRegistrationModel.objects.filter(status='waiting').count()

        users = UserRegistrationModel.objects.all()
        skda_values = []
        for u in users:
            try:
                skda_values.append(
                    {'name': u.name, 'loginid': u.loginid, 'skda': int(u.skda)}
                )
            except (ValueError, TypeError):
                skda_values.append({'name': u.name, 'loginid': u.loginid, 'skda': 0})

        return JsonResponse({
            'success': True,
            'total_users': total_users,
            'active_users': active_users,
            'pending_users': pending_users,
            'skda_distribution': skda_values,
        })
    except Exception as e:  # noqa: BLE001
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def api_logout(request):
    """Logout user."""
    try:
        request.session.flush()
        return JsonResponse({'success': True, 'message': 'Logged out successfully'})
    except Exception as e:  # noqa: BLE001
        return JsonResponse({'success': False, 'message': str(e)}, status=400)
