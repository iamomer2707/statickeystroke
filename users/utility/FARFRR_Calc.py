import os

import pandas as pd
from django.conf import settings
from sklearn import metrics
from sklearn.model_selection import train_test_split

path = os.path.join(settings.MEDIA_ROOT, 'data.csv')
df = pd.read_csv(path)
X = df.iloc[:, :-1].values  # indipendent variable
y = df.iloc[:, -1].values  # Dependent variable
X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=0.80, random_state=1)


def process_randomForest():
    from sklearn.ensemble import RandomForestClassifier
    clf = RandomForestClassifier()
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    # import pickle
    # # now you can save it to a file
    # with open(r'rice_pred.pkl', 'wb') as f:
    #     pickle.dump(clf, f)
    print(clf.score(X_test, y_test))
    rf_report = metrics.classification_report(y_test, y_pred, output_dict=True)
    print("Classification report for - \n{}:\n{}\n".format(clf, rf_report))
    CM = metrics.confusion_matrix(y_test, y_pred)
    print(CM)
    TN = CM[0][0]
    FN = CM[1][1]
    TP = CM[2][2]
    FP = CM[3][3]
    print(f"{TN},{FN},{TP}, {FP}")
    FAR = FP / (FP + TN)
    FRR = FN / (FN + TP)
    ERR = (FAR + FRR) / 2
    return rf_report, round(FAR, 2), round(FRR, 2), round(ERR, 2)
