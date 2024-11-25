import { Router } from "express"

const courseRoute = Router(),
courseDb = [
  {
  course: "Doctor of Health and Safety Sciences", 
  overview: "Our online Executive Doctor of Health and Safety Sciences program is designed to empower professionals like you to achieve excellence in health and safety management. With a focus on advanced research, strategic thinking, and global perspectives, this program will equip you with the expertise to drive positive change in your organization and beyond.", 
  courseHighlight: [
    {1: "Advanced Research and Analysis: Develop cutting-edge research skills to tackle complex health and safety challenges"},
    {2: "Strategic Health and Safety Management: Learn to design and implement effective health and safety strategies"},
    {3: "Global Health and Safety Perspectives: Explore global best practices and network with international peers"},
    {4: "Personalized Mentoring and Coaching: Receive tailored guidance from experienced health and safety experts"},
    {5: "Flexible, Self-Paced Online Learning: Study at your own pace, anytime, anywhere"}
  ],
  semester: [
    {year: 'Year 1 (600 CPD points)',
     content: [
      {topic: "Introduction to Health and Safety Sciences", points: "30 CPD points, 6 weeks"},
      {topic: "Environmental Science", points: '30 CPD points, 6 weeks'},
      {topic: "Human Anatomy and Physiology", points: '30 CPD points, 6 weeks'},
      {topic: "Chemistry for Health and Safety", points: '30 CPD points, 6 weeks'},
      {topic: "Health and Safety Management", points: '30 CPD points, 6 weeks'},
    ]},
    {year: 'Core and Specialized Courses (150 CPD points)',
     content: [
      {topic: "Occupational Health and Hygiene", points: "30 CPD points, 6 weeks"},
      {topic: "Safety Management Systems", points: '30 CPD points, 6 weeks'},
      {topic: "Risk Assessment and Management", points: '30 CPD points, 6 weeks'},
      {topic: "Health and Safety Law and Regulations", points: '30 CPD points, 6 weeks'},
      {topic: "Epidemiology and Biostatistics", points: '30 CPD points, 6 weeks'}
    ],
    seminar: {topic: 'Health and Safety Trends and Challenges', points: '100 CPD points, 2 days'},
    workshop: {topic: 'Health and Safety Leadership', points: '100 CPD points, 3 days'}
  },
    {year: 'Year 2 (600 CPD points) Semester 3: Advanced and Specialized Courses (150 CPD points)',
      content: [
        {topic: "Environmental Health and Sustainability", points: "30 CPD points, 6 weeks"},
        {topic: "Health and Safety Culture and Behavior", points: '30 CPD points, 6 weeks'},
        {topic: "Emergency Preparedness and Response", points: '30 CPD points, 6 weeks'},
        {topic: "Health and Safety Policy and Strategy", points: '30 CPD points, 6 weeks'},
        {topic: "Advanced Health and Safety Management", points: '30 CPD points, 6 weeks'}
     ]},
    {year: 'Semester 4: Applied Project Capstone and Electives (150 CPD points)',
      content: [
        {topic: "Applied Project in Health and Safety Sciences (Capstone)", points: "100 CPD points, 12 weeks"},
        {topic: "Leadership and Communication in Health and Safety", points: '25 CPD points, 3 weeks'},
        {topic: "Global Health and Safety Perspectives", points: '25 CPD points, 3 weeks'}
     ],
     seminar: {topic: 'Best Practices in Health and Safety', points: '100 CPD points, 2 days'},
     workshop: {topic: 'Health and Safety Innovation', points: '100 CPD points, 3 days'}
    },
  ],
  projectTopics:
    {overview: "Choose one topic and write on", topics: [
      {1: "Development of a Comprehensive Health and Safety Program for a Multinational Corporation."},
      {2: "Conducting a Risk Assessment and Management Plan for a High-Hazard Industry."},
      {3: "Evaluating the Effectiveness of Health and Safety Training Programs in Reducing Workplace Accidents"},
      {4: "Designing an Emergency Response Plan for a Natural Disaster-Prone Area."},
      {5: "Implementing a Health and Safety Management System in a Small to Medium-Sized Enterprise."},
      {6: "Investigating and Analyzing Health and Safety Incidents Using Advanced Data Analytics."},
      {7: "Developing a Health and Safety Culture in a Diverse and Globalized Workplace."},
      {8: "Creating a Health and Safety Policy for a New Industry or Sector."}
    ]},
  outcome: [
    {1: "Enhanced health and safety knowledge and skills"},
    {2: "Advanced research and problem-solving skills"},
    {3: "Global network of peers and industry experts"},
    {4: "Career advancement opportunities"},
    {5: "Personal and professional growth"}
  ]
},
  {
  course: "Doctor of Business Administration", 
  overview: "Enhance your leadership skills and advance your career with our online Executive Doctor of Business Administration program. This professional development and continuing education opportunity is designed for:", 
  courseOverviewList: [
    {1: "Business professionals seeking advanced knowledge and skills"},
    {2: "Entrepreneurs looking to grow their ventures"}, 
    {3: "Executives aiming to enhance their strategic thinking"},
    {4: "Anyone interested in business and leadership development"}
  ],
  courseHighlight: [
    {1: "Advanced research and analysis skills"},
    {2: "Strategic leadership and management"},
    {3: "Global business perspectives"},
    {4: "Personalized mentoring and coaching"},
    {5: "Flexible, self-paced online learning"}
  ],
  semester: [
    {year: 'Year 1, Semester 1 (300 CPD points)',
     content: [
      {topic: "Principles of Management", points: "100 CPD points, 10 weeks"},
      {topic: "Human Resource Management", points: '100 CPD points, 10 weeks'},
      {topic: "Business Statistics", points: '50 CPD points, 5 weeks'},
      {topic: "Introduction to Essentials of Marketing", points: '50 CPD points, 5 weeks'}
    ]},
    {year: 'Year 1, Semester 2 (300 CPD points)',
     content: [
      {topic: "Organizational Theory", points: "100 CPD points, 10 weeks"},
      {topic: "Financial Management for Managers", points: '100 CPD points, 10 weeks'},
      {topic: "Management Accounting", points: '50 CPD points, 5 weeks'},
      {topic: "Social Research Methods ", points: '50 CPD points, 5 weeks'}
    ]},
    {year: 'Year 2, Semester 3 (300 CPD points)',
      content: [
       {topic: "Strategic Management ", points: "100 CPD points, 10 weeks"},
       {topic: "International Business", points: '100 CPD points, 10 weeks'},
       {topic: "Innovation, Business Models and Entrepreneurship ", points: '50 CPD points, 5 weeks'},
       {topic: "Leadership and Team Effectiveness", points: '50 CPD points, 5 weeks'}
     ]},
    {year: 'Year 2, Semester 4 (300 CPD points)',
      content: [
       {topic: "Project Management for Managers ", points: "50 CPD points, 10 weeks"},
       {topic: "Supply Chain Management", points: '50 CPD points, 10 weeks'},
       {topic: "Production and Operation Management", points: '50 CPD points, 5 weeks'},
       {topic: "Business Case Studies", points: '50 CPD points, 5 weeks'},
       {topic: "Applied Project Capstone", points: '50 CPD points, 5 weeks'},
       {topic: "Business Law", points: '50 CPD points, 5 weeks'},
     ]},
  ],
  projectTopics:
    {overview: "Choose one topic and write on", topics: [
      {1: "Strategic Business Plan for a New Venture: Develop a comprehensive business plan for a new product or service."},
      {2: "Operational Efficiency Improvement: Identify areas for improvement in an existing organization's operations and propose solutions."},
      {3: "Market Research and Analysis: Conduct market research to identify trends, opportunities, and challenges in a specific industry."},
      {4: "Leadership Development Plan: Design a leadership development program for an organization."},
      {5: "Innovation and Entrepreneurship: Develop a plan for introducing innovation and entrepreneurship within an existing organization."},
      {6: "Change Management Plan: Create a plan for implementing organizational change."},
      {7: "Sustainability and Social Responsibility: Develop a plan for an organization to improve its sustainability and social responsibility practices."},
      {8: "Digital Transformation Strategy: Develop a strategy for an organization to leverage digital technologies."}
    ]},
  outcome: [
    {1: "Enhanced leadership and strategic thinking"},
    {2: "Advanced research and problem-solving skills"},
    {3: "Global network of peers and industry experts"},
    {4: "Career advancement opportunities"},
    {5: "Personal and professional growth"}
  ]
},
  ]

courseRoute.get('/course/:course', async (req, res) => {
  const course = req.params.course.toLowerCase(),
  findCourse = courseDb.find(user => user.course.toLowerCase() === course)
  if(!findCourse) return res.render('index', {page: 404})
  res.status(200).render("index", {page: "course", title: course.toUpperCase(), findCourse})
})

export default courseRoute