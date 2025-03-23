Installation
Clone the Repository:

git clone https://github.com/your-username/your-repo-name.git


Navigate to the Frontend Directory:

npm install

Start the Frontend Server:

npm start


Backend Setup
Navigate to the Backend Directory:

cd backend
Create a Virtual Environment:

python -m venv env
Activate the Virtual Environment:

On Windows:

text
.\env\Scripts\activate
On Unix/Linux/MacOS:

source env/bin/activate
Install Dependencies:

pip install -r requirements.txt
Run Migrations:

python manage.py makemigration
python manage.py migrate

Start the Backend Server:

python manage.py runserver