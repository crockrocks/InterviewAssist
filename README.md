# Interview Assist

## Description
Interview Assist is an innovative application designed to automate the entire interview process, streamlining recruitment for both interviewers and candidates.

## Features
- **Automated Scheduling:** Efficiently manage interview timeslots and candidate bookings.
- **AI-Powered Question Generation:** Dynamic creation of relevant interview questions based on job descriptions and candidate profiles.
- **Real-time Video Interviews:** Conduct seamless video interviews with integrated assessment tools.
- **Candidate Evaluation:** Utilize AI algorithms to analyze candidate responses and provide objective feedback.
- **Interview Recording:** Securely record and store interviews for future reference and analysis.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later)
- [Python 3.x](https://www.python.org/downloads/) (3.7 or later)
- npm (usually comes with Node.js)
- pip (Python package manager)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/crockrocks/sih.git
   cd sih/interview
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The application will now be running at `http://localhost:5174` (or another port if configured).

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   - For Linux/macOS:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```
   - For Windows:
     ```bash
     python -m venv .venv
     .venv\Scripts\activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask application:
   ```bash
   python3 app.py
   ```

   The backend will now be running at `http://localhost:5000`.

## Project Structure

```
.
├── src
│   ├── components
│   ├── assets
├── public
├── README.md
├── backend
    ├── app.py
    ├── requirements.txt
```

## Technologies Used

### Frontend
- React.js
- Tailwind CSS
- React Icons

### Backend
- Flask (Python)
- Flask-RESTful for API routes
- SQLAlchemy for database management

## Contact

If you have any questions, suggestions, or need further assistance, please feel free to contact us:

- Email: harshpant3703@gmail.com
- GitHub Issues: [Project Issues Page](https://github.com/crockrocks/sih/issues)

## Acknowledgments
- Thanks to all contributors who have helped shape Interview Assist.
