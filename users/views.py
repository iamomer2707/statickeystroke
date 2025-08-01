# Create your views here.
from django.shortcuts import render, HttpResponse
from django.contrib import messages
from .forms import UserRegistrationForm
from .models import UserRegistrationModel
from django.conf import settings

import numpy as np
import pandas as pd
import os


# Create your views here.
def UserRegisterActions(request):
    if request.method == 'POST':
        # UserRegistrationModel.objects.all().delete()
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            print('Data is Valid')
            skda = form.cleaned_data['skda']
            print("Milli Seconds:", skda)
            form.save()
            messages.success(request, 'You have been successfully registered')
            form = UserRegistrationForm()
            return render(request, 'UserRegistrations.html', {'form': form, 'skda': skda})
        else:
            messages.success(request, 'Email or Mobile Already Existed')
            print("Invalid form")
    else:
        form = UserRegistrationForm()
    return render(request, 'UserRegistrations.html', {'form': form})


def UserLoginCheck(request):
    if request.method == "POST":
        loginid = request.POST.get('loginid')
        pswd = request.POST.get('pswd')
        print("Login ID = ", loginid, ' Password = ', pswd)
        try:
            check = UserRegistrationModel.objects.get(loginid=loginid, password=pswd)
            status = check.status
            print('Status is = ', status)
            if status == "activated":
                request.session['id'] = check.id
                request.session['loggeduser'] = check.name
                request.session['loginid'] = loginid
                request.session['email'] = check.email
                print("User id At", check.id, status)
                return render(request, 'users/UserHomePage.html', {})
            else:
                messages.success(request, 'Your Account Not at activated')
                return render(request, 'UserLogin.html')
        except Exception as e:
            print('Exception is ', str(e))
            pass
        messages.success(request, 'Invalid Login id and password')
    return render(request, 'UserLogin.html', {})


def UserHome(request):
    return render(request, 'users/UserHomePage.html', {})


def DatasetView(request):
    path = os.path.join(settings.MEDIA_ROOT, 'data.csv')
    df = pd.read_csv(path)
    df = df.to_html(index=False)
    return render(request, 'users/viewdataset.html', {'data': df})


def UserClassification(request):
    import pandas as pd
    from .utility import FARFRR_Calc
    rf_report,FAR,FRR,ERR = FARFRR_Calc.process_randomForest()
    rf_report = pd.DataFrame(rf_report).transpose()
    rf_report = pd.DataFrame(rf_report)

    return render(request, 'users/results.html',
                  {'rf': rf_report.to_html,'far': FAR,'frr':FRR,'err': ERR})


def UserChangePassword(request):
    if request.method == 'POST':
        cpassword = request.POST.get('cpassword')
        npassword = request.POST.get('npassword')
        cskda = int(request.POST.get('cskda'))
        nskda = int(request.POST.get('nskda'))
        loginid = request.session['loginid']
        data = UserRegistrationModel.objects.get(loginid=loginid, password=cpassword)
        dbMillis = int(data.skda)
        print(f"{cpassword}: {npassword}: {cskda}: {nskda} DB Millis: {dbMillis}")
        if dbMillis - 300 <= cskda <= dbMillis + 300:
            print("True Condition")
            UserRegistrationModel.objects.filter(loginid=loginid, password=cpassword).update(password=npassword,
                                                                                             skda=nskda)
            return render(request, "users/UserChangePassword.html", {'msg': 'Your Password Successful Update'})
        else:
            print("False Condition")

            return render(request, "users/UserChangePassword.html", {'msg': 'Your Keystroke doesnot Match'})



    else:
        return render(request, "users/UserChangePassword.html", {})
