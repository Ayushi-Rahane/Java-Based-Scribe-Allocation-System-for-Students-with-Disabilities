from pymongo import MongoClient
import bcrypt
import datetime
from bson.objectid import ObjectId

uri = "mongodb+srv://ayushirahane2021_db_user:acfprQTqpzEUheUn@cluster0.kuvesep.mongodb.net/scribe_allocation?appName=Cluster0"
client = MongoClient(uri)
db = client['scribe_allocation']

password_str = "12344321"
password_bytes = password_str.encode('utf-8')
# Spring security uses standard 10 rounds bcrypt
hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt(10)).decode('utf-8')

stu1_id = ObjectId()
stu2_id = ObjectId()
stu3_id = ObjectId()

students_data = [
    { "_id": stu1_id, "fullName": "Amit Sharma", "email": "amit.student@test.com", "password": hashed_password, "role": "STUDENT", "phone": "9876543210", "city": "Mumbai", "state": "Maharashtra", "disabilityType": "Visual Impairment", "academicLevel": "Undergraduate", "currentInstitution": "Mumbai University" },
    { "_id": stu2_id, "fullName": "Priya Patel", "email": "priya.student@test.com", "password": hashed_password, "role": "STUDENT", "phone": "9876543211", "city": "Pune", "state": "Maharashtra", "disabilityType": "Visual Impairment", "academicLevel": "Postgraduate", "currentInstitution": "Pune University" },
    { "_id": stu3_id, "fullName": "Rahul Gupta", "email": "rahul.student@test.com", "password": hashed_password, "role": "STUDENT", "phone": "9876543212", "city": "Delhi", "state": "Delhi", "disabilityType": "Learning Disability", "academicLevel": "High School", "currentInstitution": "DPS RK Puram" },
]

vol1_id = ObjectId()
vol2_id = ObjectId()
vol3_id = ObjectId()
vol4_id = ObjectId()
vol5_id = ObjectId()

availability = {
    "Monday": { "morning": True, "afternoon": False, "evening": False },
    "Tuesday": { "morning": False, "afternoon": True, "evening": False },
    "Wednesday": { "morning": False, "afternoon": False, "evening": True },
    "Thursday": { "morning": False, "afternoon": False, "evening": True },
    "Friday": { "morning": False, "afternoon": False, "evening": True },
    "Saturday": { "morning": False, "afternoon": False, "evening": True },
    "Sunday": { "morning": False, "afternoon": False, "evening": True }
}

volunteers_data = [
    { "_id": vol1_id, "fullName": "Rohit Verma", "email": "rohit.vol@test.com", "password": hashed_password, "role": "VOLUNTEER", "phone": "9123456780", "city": "Mumbai", "state": "Maharashtra", "subjects": ["Mathematics", "Physics"], "languages": ["English", "Hindi"], "rating": 4.8, "totalRatings": 5, "totalSessionsCompleted": 10, "availability": availability },
    { "_id": vol2_id, "fullName": "Sneha Joshi", "email": "sneha.vol@test.com", "password": hashed_password, "role": "VOLUNTEER", "phone": "9123456781", "city": "Pune", "state": "Maharashtra", "subjects": ["Biology", "Chemistry"], "languages": ["English", "Marathi"], "rating": 4.5, "totalRatings": 3, "totalSessionsCompleted": 4 , "availability": availability},
    { "_id": vol3_id, "fullName": "Vikram Singh", "email": "vikram.vol@test.com", "password": hashed_password, "role": "VOLUNTEER", "phone": "9123456782", "city": "Delhi", "state": "Delhi", "subjects": ["History", "Political Science"], "languages": ["English", "Hindi"], "rating": 5.0, "totalRatings": 2, "totalSessionsCompleted": 2, "availability": availability },
    { "_id": vol4_id, "fullName": "Neha Kadam", "email": "neha.vol@test.com", "password": hashed_password, "role": "VOLUNTEER", "phone": "9123456783", "city": "Mumbai", "state": "Maharashtra", "subjects": ["Computer Science", "IT"], "languages": ["English"], "rating": 0.0, "totalRatings": 0, "totalSessionsCompleted": 0, "availability": availability },
    { "_id": vol5_id, "fullName": "Sanjay Das", "email": "sanjay.vol@test.com", "password": hashed_password, "role": "VOLUNTEER", "phone": "9123456784", "city": "Pune", "state": "Maharashtra", "subjects": ["Economics", "Accounting", "Mathematics"], "languages": ["English", "Hindi", "Marathi"], "rating": 0.0, "totalRatings": 0, "totalSessionsCompleted": 0, "availability": availability },
]

# Note: LocalDateTime saved as datetime obj
requests_data = [
    {
        "_id": ObjectId(),
        "studentId": str(stu1_id),
        "studentName": students_data[0]["fullName"],
        "disabilityType": students_data[0]["disabilityType"],
        "subject": "Mathematics",
        "examType": "Final",
        "examDate": "2026-05-10",
        "examTime": "10:00",
        "duration": 3,
        "preferredLanguage": "English",
        "city": students_data[0]["city"],
        "state": students_data[0]["state"],
        "location": "Mumbai University Campus",
        "status": "PENDING",
        "createdAt": datetime.datetime.utcnow(),
        "materials": []
    },
    {
        "_id": ObjectId(),
        "studentId": str(stu2_id),
        "studentName": students_data[1]["fullName"],
        "disabilityType": students_data[1]["disabilityType"],
        "subject": "Biology",
        "examType": "Midterm",
        "examDate": "2026-05-12",
        "examTime": "14:00",
        "duration": 2,
        "preferredLanguage": "Marathi",
        "city": students_data[1]["city"],
        "state": students_data[1]["state"],
        "location": "Pune Exam Center",
        "status": "PENDING",
        "createdAt": datetime.datetime.utcnow(),
        "materials": []
    },
    {
        "_id": ObjectId(),
        "studentId": str(stu3_id),
        "studentName": students_data[2]["fullName"],
        "disabilityType": students_data[2]["disabilityType"],
        "subject": "History",
        "examType": "Internal",
        "examDate": "2026-05-15",
        "examTime": "09:00",
        "duration": 3,
        "preferredLanguage": "Hindi",
        "city": students_data[2]["city"],
        "state": students_data[2]["state"],
        "location": "Delhi Testing Facility",
        "status": "PENDING",
        "createdAt": datetime.datetime.utcnow(),
        "materials": []
    },
    {
        "_id": ObjectId(),
        "studentId": str(stu1_id),
        "studentName": students_data[0]["fullName"],
        "disabilityType": students_data[0]["disabilityType"],
        "subject": "Physics",
        "examType": "Final",
        "examDate": "2026-05-18",
        "examTime": "10:00",
        "duration": 3,
        "preferredLanguage": "English",
        "city": students_data[0]["city"],
        "state": students_data[0]["state"],
        "location": "Mumbai University Campus",
        "status": "ACCEPTED",
        "volunteerId": str(vol1_id),
        "createdAt": datetime.datetime.utcnow() - datetime.timedelta(days=2),
        "acceptedAt": datetime.datetime.utcnow() - datetime.timedelta(days=1),
        "materials": []
    },
    {
        "_id": ObjectId(),
        "studentId": str(stu2_id),
        "studentName": students_data[1]["fullName"],
        "disabilityType": students_data[1]["disabilityType"],
        "subject": "Chemistry",
        "examType": "Practical",
        "examDate": "2026-04-10",
        "examTime": "10:00",
        "duration": 2,
        "preferredLanguage": "English",
        "city": students_data[1]["city"],
        "state": students_data[1]["state"],
        "location": "Pune Science Hub",
        "status": "COMPLETED",
        "volunteerId": str(vol2_id),
        "createdAt": datetime.datetime.utcnow() - datetime.timedelta(days=10),
        "acceptedAt": datetime.datetime.utcnow() - datetime.timedelta(days=8),
        "completedAt": datetime.datetime.utcnow() - datetime.timedelta(days=2),
        "materials": [],
        "rating": 5,
        "review": "Very helpful and understanding!"
    }
]

db.students.insert_many(students_data)
db.volunteers.insert_many(volunteers_data)
db.requests.insert_many(requests_data)

print(f"Insertion complete. Inserted {len(students_data)} students, {len(volunteers_data)} volunteers, and {len(requests_data)} requests.")
