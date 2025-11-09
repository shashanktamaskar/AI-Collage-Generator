# AI Social Media Collage Creator

A powerful, client-side web application that uses Google's Gemini AI to automatically create stunning, high-resolution social media collages. It intelligently selects the best photos, arranges them in professional layouts, adds your branding, and automatically optimizes for the highest quality and social media impact.

## ✨ Features

🤖 **AI-Powered Photo Curation**: Automatically analyzes a large batch of photos to select the most engaging ones based on subject clarity, composition, emotional impact, and storytelling potential.

🚀 **Automatic Quality Optimization**: If the AI's initial collage doesn't meet a high-quality standard (an "Impact Score" > 9/10), the application automatically retries up to 3 times, seeking a better combination of photos to create a superior result.

🖼️ **High-Resolution Output**: Generates collages at a crisp 2400x3000 resolution, ensuring your final image looks professional on high-density displays.

🎨 **Professional & Dynamic Layouts**: Features unique, aesthetically pleasing layouts for collages containing 4, 5, 6, or 7 photos.

🏷️ **Customizable Branding**: Easily add your school/event name, date, and a custom header color to match your brand identity.

⭐ **AI Quality & Impact Analysis**: Performs a final AI check on the generated collage to provide an "Impact Score," evaluating its professional appearance, layout, and potential for social media engagement.

🔒 **100% Client-Side & Private**: Runs entirely in your web browser. Your API key and photos are never uploaded to a server, ensuring complete privacy.

📦 **Streamlined ZIP File Upload**: Accepts a single .zip file containing all your event photos for a simple and efficient user experience.

## 🚀 How to Use

### Get a Google AI API Key:

1. Visit the [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key" and copy the key

### Prepare Your Files:

1. Place all your event photos into a single folder
2. Compress this folder into a .zip file
3. Have your project/school logo file (.png, .jpg) ready

### Run the Application:

**Option 1: Use the Live Demo (Recommended)**

Visit: `https://shashanktamaskar.github.io/AI-Collage-Generator/`

**Option 2: Run Locally**

1. Clone this repository:
   ```bash
   git clone https://github.com/shashanktamaskar/AI-Collage-Generator.git
   cd AI-Collage-Generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Create Your Collage:

1. Paste your API key when prompted
2. Fill in the event details (Name, Date, Color)
3. Select the number of photos you want in the final collage (4-7)
4. Upload your photos .zip file and your logo file
5. Click "Generate My Collage" and let the AI do the work!

## 🛠️ How It Works (Technical Deep Dive)

The application follows a sophisticated, multi-step workflow orchestrated by React, all within the user's browser.

1. **Setup & File Handling**: The user provides an API key, event details, a logo, and a .zip file of photos. The JSZip library efficiently unzips the images in the browser's memory into an array of File objects.

2. **AI Optimization Loop (The Core Engine)**:
   - **Thumbnail Grid Creation**: To analyze photos efficiently, a single composite image (a thumbnail grid) is created on a `<canvas>` from all uploaded photos.
   - **AI Photo Selection**: This grid is sent to the Gemini Vision API with a detailed prompt asking it to act as a social media expert and select the best N photos (where N is 4, 5, 6, or 7).
   - **High-Resolution Collage Generation**: The application retrieves the selected full-resolution photos and draws them onto a high-resolution (2400x3000) `<canvas>` using a professional, pre-defined layout specific to the number of photos. The header and logo are also rendered.
   - **AI Quality & Impact Check**: The final collage is sent back to the Gemini Vision API. This time, the AI is prompted to act as both a graphic designer and a social media expert to provide a single combined "Impact Score" out of 10.
   - **Decision & Retry**: If the Impact Score is greater than 9, the process is complete. If not, the loop runs again (up to a maximum of 3 attempts). If the max attempts are reached, the collage with the highest score from all attempts is chosen.

3. **Display Results**: The final, best-scoring collage and the AI's detailed feedback are displayed, with options to download the image or start over.

## 💻 Technology Stack

- **Frontend**: React, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **File Handling**: JSZip
- **Deployment**: GitHub Pages

## 📂 Project Structure

```
/
├── components/         # Reusable React components (ApiKeyScreen, DropZone, etc.)
├── services/           # Modules for external interactions (geminiService, imageService)
├── utils/              # Helper functions (fileUtils for zipping/unzipping)
├── types.ts            # Shared TypeScript type definitions
├── App.tsx             # Main application component, manages state and workflow
├── index.tsx           # Entry point for the React application
└── index.html          # Main HTML file
```

## 🔧 How to Modify & Customize

- **AI Prompts**: To change the AI's behavior for photo selection or quality analysis, edit the prompt strings inside `services/geminiService.ts`.
- **Collage Layouts**: The layout logic for 4, 5, 6, and 7 photos is defined in `services/imageService.ts` within the `generateCollage` function. You can modify the `drawImageCropped` calls to create new layouts.
- **Default Values**: Default event details (school name, header color) can be changed in the `useState` hook for `eventDetails` inside `App.tsx`.

## 🚀 Deployment

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment (Recommended)

Every push to the `main` branch automatically triggers a GitHub Actions workflow that builds and deploys the app.

**Setup Steps:**

1. Go to your repository Settings → Pages
2. Under "Build and deployment", select:
   - Source: **GitHub Actions**
3. Push your changes to the `main` branch
4. The app will be automatically deployed to: `https://[username].github.io/AI-Collage-Generator/`

### Manual Deployment

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# The dist/ folder contains your static files
# You can deploy this folder to any static hosting service
```

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- Powered by [Google Gemini AI](https://ai.google.dev/)
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
