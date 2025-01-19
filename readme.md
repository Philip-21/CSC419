## Group14 Hospital Information system


Project Description
 An information system: The primary purpose of this type of system is to manage and provide access to a database of information. Issues in information systems include security, usability, privacy, and maintaining data integrity. The example of an information system used is a medical record system 



### Project Proposal

#### 1. Plan the Distributed System Architecture
Distribute the database tables across several systems. This ensures a distributed database architecture. Steps to achieve this:
A.	Identify the Tables:
 Divide the database tables logically. For example:
	 patients on System 1
	appointments on System 2
	doctors on System 3

B.	 Homogeneity: Ensure all systems use the same database software (e.g., MySQL or    
  PostgreSQL).
C.	 Use foreign keys to enable relationships and cross table queries 
D.	Enable secure authentication mechanism across the system for both patients and doctors

#### 2. Implement the Database Application

A. Application Stack
    Backend: The system will use a server-side language like Golang for handling     
    database operations and API requests.

B. CRUD Operations
    The application will support the following core operations:
        1.	Create: Add new records (e.g., register patients or schedule appointments).
        2.	Read: Retrieve data (e.g., view patient appointments or doctor lists).
        3.	Update: Modify existing records (e.g., update patient information).
        4.	Delete: Remove obsolete records (e.g., outdated appointments).
C. Software Documentation
    API documentation will be generated using Swagger, providing details of endpoints and enabling testing via 
    an interactive interface.



