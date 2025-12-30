# RUIMUN '26: The Official Conference Portal

Welcome to the official web portal for the Redeemer's University International Model United Nations (RUIMUN) 2026 conference. This platform is a comprehensive, full-stack application designed to manage all aspects of the delegate and administrative experience.

Our vision is **to be a leading Model UN conference that inspires positive change, promotes multicultural understanding, and cultivates a lasting commitment to peace, development, and human rights among all participants.**

---

## ✨ Features

This portal is split into two main sections: a public-facing site for information and registration, and a secure dashboard for registered delegates and administrators.

### Delegate Experience
- **User Authentication:** Secure registration and login system with email verification.
- **Registration Form:** A multi-step form for delegates to submit personal information, academic background, and committee preferences.
- **Delegate Dashboard:** A personalized portal for delegates to review their application, check their payment status, and view their final committee and country assignments.
- **Static Pages:** Includes an "About" page detailing the conference's mission and a "Resources" section (currently under development).

### Administrative Dashboard
- **Delegates Management:** A comprehensive table of all registered delegates.
- **Advanced Filtering & Search:** Admins can search for delegates and apply multiple filters, including payment status, assignment status, and a special filter for "History and International Studies" students.
- **Detailed View:** A modal view provides an at-a-glance look at a delegate's complete registration profile.
- **Payment Tracking:** A dedicated page to manage and update the payment status of each delegate.
- **Committee Assignment:** An interface for admins to assign committees and countries to verified delegates, with logic to prevent double-booking of countries within a committee.

---

## 🛠️ Tech Stack

This project is built with a modern, robust, and scalable technology stack.

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (including Firestore, Authentication, and Hosting)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** Built using [shadcn/ui](https://ui.shadcn.com/) for elegant and accessible components.
- **Deployment:** The application is deployed on [Firebase Hosting](https://firebase.google.com/docs/hosting).

---

## 🎨 Design System

The portal's design is guided by a clean and professional aesthetic to ensure a seamless user experience.

-   **Primary Color:** Gold (`#7F6610`) to convey elegance and professionalism.
-   **Background Color:** A very light gold (`#F2F0EC`) for a clean, contrasting backdrop.
-   **Accent Color:** Russet (`#804617`) for calls to action.
-   **Body Font:** `Inter` for a modern, neutral, and highly readable look.
-   **Headline Font:** `Space Grotesk` to provide a contemporary touch to headlines.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js and npm (or yarn) installed.
- A Firebase project set up.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repo-url>
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Firebase project configuration keys:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:3000`.
