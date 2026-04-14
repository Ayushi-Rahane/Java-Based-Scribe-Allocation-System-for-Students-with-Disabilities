# Presentation Script: AI-Powered Scribe Matching Platform

*(Note: Member 1 speaks the entire first half, then hands over to Member 2 who finishes the presentation. They do not switch back and forth.)*

---

### PART 1: DELIVERED BY MEMBER 1

**1. INTRODUCTION & PROBLEM STATEMENT**
"Good morning, respected teachers and friends. The title of our mini project is 'AI-Powered Scribe Matching Platform'. It is a web application that helps students with disabilities, especially visually impaired students, easily find volunteer scribes to write their exams.

Currently, visually impaired students face a lot of stress finding a reliable scribe before exams. They have to ask around manually, which wastes time and energy. Our objective is to automate this. We want to connect students with the right volunteers quickly, so students can focus on studying instead of worrying about finding a writer."

**2. SYSTEM OVERVIEW & KEY FEATURES**
"So, how does it work? Our system has two main users: the Student and the Volunteer. 
The student simply posts their exam details—like the subject, date, and time—and they can even upload study materials. Then, our system automatically finds the best volunteers for them based on location and subjects. The volunteer is alerted and can accept the request with one click. We also track the exact status of the request from 'Pending' to 'Accepted' to 'Completed'."

**3. FRONTEND TECHNOLOGIES (THE 'VIEW')**
"To build this, we had to choose modern and reliable technologies. I will explain the Frontend, which is what the user actually sees on their screen.
- **What we used:** We used **React** and **Tailwind CSS**. 
- **Where we used it:** We used these to build the student and volunteer dashboards, the login pages, and all the buttons you click.
- **Why we used it:** We chose React because it is very fast and makes the website feel like a smooth mobile app. We chose Tailwind CSS because it helps us make the design look beautiful and easy to read. In our design model, this frontend acts as the **View**, which my partner will expand on next. 

Over to you."

---

### PART 2: DELIVERED BY MEMBER 2

**4. BACKEND & DATABASE TECHNOLOGIES**
"Thank you. Now, I will explain what happens behind the scenes—our Backend and Database.
- **What we used:** We used **Java** with the **Spring Boot** framework for our backend, and **MongoDB** for our database.
- **Where we used it:** Spring Boot powers our server, handles user logins, and stores the rules of how the system works. MongoDB is where we safely keep all user profiles and request details.
- **Why we used it:** We chose Java and Spring Boot because it is secure, strong, and can handle complex math perfectly. We chose MongoDB because it is very flexible with storing data and fast at searching."

**5. HOW OUR 'MATCHING LOGIC' WORKS (IN DEPTH)**
"The most unique part of our project is the Matching Logic. Instead of just showing a random list of students to a volunteer, we built a smart scoring system out of 100 points. Here is exactly how it makes the perfect match:
- **Step 1 is Location (50 points):** The system first checks if the volunteer and the student live in the exact same city. If they do, they get 50 points because physical presence is the most important for exams. 
- **Step 2 is Subject (30 points):** Then, it checks if the volunteer knows the exam subject. We even made it smart enough to know that words like 'Math', 'Calculus', and 'Mathematics' mean the same thing. If it matches, that's another 30 points.
- **Step 3 is Language (20 points):** Finally, it checks if the volunteer speaks the student's preferred language, bringing the maximum score to 100 points.

The system adds up these points, sorts the list, and shows the volunteer the students with the highest scores right at the top of their screen!"

**6. MVC ARCHITECTURE IN DETAIL**
"Our entire project was built using the **MVC Pattern**, which stands for Model, View, and Controller. Let me explain how we used it:
- **M format is Model (Data):** This represents our MongoDB database and Java data classes. It holds physical information, like the user's name and the matching score.
- **V format is View (Interface):** Our React frontend is the View. It is the visible dashboard where you click buttons. It doesn't do complex math, it just displays data.
- **C format is Controller (The Brain):** Our Spring Boot APIs act as the Controller. When a volunteer opens the app, the Controller pulls the data from the Model, runs the 100-point Matching Logic we just talked about, and sends the sorted matches back to the View for the volunteer to see."

**7. DEMO FLOW & CONCLUSION**
"When we run the demo today, you will see this exact MVC architecture in action. 
First, we will log in as a student to create a new exam request. Second, we will log in as a volunteer and you will see the completely matched request highlighted for them based on our scoring logic. Finally, the volunteer will click 'Accept' and the status will update.

To conclude, our platform turns a stressful manual process into a smart digital experience. Thank you!"

---

### POSSIBLE Q&A PREP (For Both Members)

**Q1: Why did you choose this project?**
**Answer:** We noticed that disabled students really struggle right before exams to find writers. We wanted to use our technical skills to build something that solves a real social problem.

**Q2: How does your matching system handle different subject names?**
**Answer:** We built 'alias matching' into the logic. If a student types 'Maths' but the volunteer registered with 'Calculus', the system is smart enough to know they are related and still gives them the 30 match points.

**Q3: What is the benefit of your MVC architecture?**
**Answer:** MVC keeps our code very clean and separated. By keeping the React View separate from the Java Model and Controller, one team member can fix the website design while the other works on the database, without breaking each other's code.

**Q4: What happens if no volunteer matches the student's city?**
**Answer:** As a fallback, if our Step 1 location filter finds exactly zero people, the system will temporarily drop the location rule and just show all pending requests, so the student isn't left completely helpless.

**Q5: Who can be a volunteer?**
**Answer:** Anybody who registers on our platform! The system will automatically use the 100-point logic to guide them to the students they are best equipped to help.
