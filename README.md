# Clinic Builder

Clinic Builder is a versatile and efficient project designed to streamline clinic management processes. This README provides all the necessary details to get started with development, testing, and deployment.

## Requirements

- **Node.js**: Version 20 or higher is required. Ensure you have it installed before proceeding.

## Setup

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:grayphite/clinic-builder.git
   cd clinic-builder
   ```

2. **Install Dependencies**:
   Use the following command to install the required dependencies:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create an `.env` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_BASE_URL = https://backend.codortal.com
   NEXT_PUBLIC_DOMAIN=oaklandsdentalhudds
   NEXT_PUBLIC_SITE_URL = https://oaklandsdentalhudds.co.uk
   ```

## Scripts

### Start Development Server
Run the application locally with the following command:
```bash
npm run dev
```

### Build for Production
Generate a production-ready build with:
```bash
npm run build
```
#run local build
npx serve out

### Analyze Build Bundle
To analyze the production build, use:
```bash
ANALYZE=true npm run build
```
This will provide insights into the bundle composition, helping to optimize performance.

## Notes

- Ensure that Node.js version 20 or higher is installed to avoid compatibility issues.
- Keep your `.env` file secure and do not share it publicly.

## Contribution

We welcome contributions to improve the project! Please follow these steps:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes and open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

