# ugpicx.com

ugpicx.com is the Unsplash version for Uganda, offering a platform exclusively for high-quality, free-to-use images from Uganda. We provide a space where photographers and creators can share their unique perspectives of Ugandan culture, landscapes, people, and more. Whether you're looking for beautiful imagery of Uganda or contributing your own, ugpicx.com is dedicated to showcasing the beauty of Uganda through the lens of its people.

## Tech Stack

- [Next.js](https://nextjs.org) - React framework for production
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Cloudflare R2](https://www.cloudflare.com/products/r2/) - Object storage solution
- [Vercel](https://vercel.com) - Deployment platform
- [Clerk](https://www.clerk.dev) - Authentication solution
- [Flutterwave](https://www.flutterwave.com) - Payment gateway

## Getting Started

### Prerequisites

1. Node.js installed (v18+ recommended)
2. Cloudflare R2 account and credentials
3. Clerk account and API keys for authentication
4. Flutterwave account and API keys for payments
5. Database setup for Prisma
6. Vercel account

### Environment Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/ugpicx.com.git
    cd ugpicx.com
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following configuration values:

    ```bash
    # Cloudflare R2 credentials
    CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key
    CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_key
    CLOUDFLARE_R2_BUCKET=your_r2_bucket_name

    # Clerk credentials
    CLERK_FRONTEND_API=your_clerk_frontend_api
    CLERK_API_KEY=your_clerk_api_key

    # Flutterwave credentials
    FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
    FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key

    # Database connection string (for Prisma)
    DATABASE_URL=your_database_connection_string
    ```

4. Run Prisma migrations:

    ```bash
    npx prisma migrate dev
    ```

5. Start the development server:

    ```bash
    npm run dev
    ```

Your app should now be running locally at [http://localhost:3000](http://localhost:3000).

## Authentication with Clerk

Clerk provides user authentication for ugpicx.com. To integrate Clerk into your application, follow these steps:

1. Sign up at [Clerk](https://www.clerk.dev).
2. Obtain your Clerk Frontend API and API Key.
3. Set up authentication routes as per Clerk’s documentation to handle sign-in, sign-up, and session management.

## Payments with Flutterwave

Flutterwave powers payments on ugpicx.com. To accept payments, follow these steps:

1. Sign up at [Flutterwave](https://www.flutterwave.com).
2. Obtain your Flutterwave public and secret keys.
3. Implement Flutterwave’s API for payment processing on image purchases, subscriptions, or donations.

## Contributing

We welcome contributions to this project! Whether you have suggestions, bug reports, or code improvements, your help is appreciated.

### How to Contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Be sure to follow the code style of the project and write tests where applicable.

## Features

- Fast and scalable image hosting
- Object storage using Cloudflare R2
- Secure and efficient database management with Prisma
- Seamless deployment to Vercel
- User authentication with Clerk
- Payment processing with Flutterwave

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions, suggestions, or just to chat about the project, feel free to reach out through the Issues section or via email at [your-email@example.com](mailto:isiagigeofrey0@gmail.com).

---

We'd love to have you onboard as a collaborator—feel free to open issues or submit pull requests with new features, improvements, or bug fixes! Thanks for contributing to the growth of ugpicx.com!
