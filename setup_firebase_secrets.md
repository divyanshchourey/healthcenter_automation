# Setting up Firebase Secrets for GitHub Actions

This guide will walk you through the process of creating a service account, granting it the necessary permissions, and adding it as a secret to your GitHub repository.

## 1. Create a Service Account

1.  Go to the [GCP Service Accounts page](https://console.cloud.google.com/iam-admin/serviceaccounts). <mcreference link="https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md" index="4">4</mcreference>
2.  Select your Firebase project from the project dropdown in the top navigation bar. <mcreference link="https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md" index="4">4</mcreference>
3.  Click **+ CREATE SERVICE ACCOUNT**. <mcreference link="https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md" index="4">4</mcreference>
4.  Give the service account a name (e.g., `github-actions-deploy`). <mcreference link="https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md" index="4">4</mcreference>
5.  Click **CREATE AND CONTINUE**.

## 2. Grant Permissions

1.  In the **Grant this service account access to project** step, add the following roles: <mcreference link="https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md" index="4">4</mcreference>
    *   **Firebase Hosting Admin**: `roles/firebasehosting.admin` <mcreference link="https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md" index="4">4</mcreference>
    *   **Firebase Authentication Admin**: `roles/firebaseauth.admin` <mcreference link="https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md" index="4">4</mcreference>
    *   **Cloud Run Viewer**: `roles/run.viewer` <mcreference link="https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md" index="4">4</mcreference>
    *   **API Keys Viewer**: `roles/serviceusage.apiKeysViewer` <mcreference link="https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md" index="4">4</mcreference>
2.  Click **CONTINUE**.
3.  Click **DONE**.

## 3. Generate a JSON Key

1.  Find the service account you just created in the list.
2.  Click the three-dot menu under **Actions** and select **Manage keys**.
3.  Click **ADD KEY** and select **Create new key**. <mcreference link="https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md" index="4">4</mcreference>
4.  Choose **JSON** as the key type and click **CREATE**. <mcreference link="https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md" index="4">4</mcreference>
5.  A JSON file will be downloaded to your computer.

## 4. Add the JSON Key as a GitHub Secret

1.  Go to your GitHub repository and click on **Settings**.
2.  In the left sidebar, click **Secrets and variables** and then **Actions**.
3.  Click **New repository secret**.
4.  For the name, enter `FIREBASE_SERVICE_ACCOUNT`. <mcreference link="https://github.com/marketplace/actions/deploy-to-firebase-hosting" index="5">5</mcreference>
5.  Open the downloaded JSON file and copy the entire content.
6.  Paste the JSON content into the **Value** field.
7.  Click **Add secret**.

## 5. Update Your Workflow File

Now, I will update your workflow file to use the new secret.