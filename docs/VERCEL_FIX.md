# How to Make Your Vercel Deployment Public

If users are seeing a login screen when visiting your Vercel link, "Deployment Protection" is enabled. Follow these steps to disable it.

## Option 1: Disable "Deployment Protection" (Recommended)

1.  Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2.  Select your project (**squadup-frontend**).
3.  Click on the **Settings** tab (top menu).
4.  Click on **Deployment Protection** (left sidebar).
5.  Find the **"Vercel Authentication"** section.
6.  **Toggle the switch to OFF** (Disabled).
    *   *Note: You might need to do this for both "Preview" and "Production" environments if you want both to be public.*
7.  Click **Save**.

## Option 2: Check which URL you are sharing

*   **Production URL:** Usually looks like `https://squadup.vercel.app`. This is usually public by default on Hobby accounts.
*   **Preview URL:** Looks like `https://squadup-git-main-username.vercel.app`. These are often protected by default so only you (the developer) can see them.

**Solution:** Ensure you are sharing the **Production Domain** that you assigned in Vercel (e.g., `squadup.vercel.app`).

## Option 3: Check Project Visibility

1.  In **Settings** > **General**.
2.  Ensure your project is not accidentally set to a private mode that restricts access (though usually "Deployment Protection" is the cause).
