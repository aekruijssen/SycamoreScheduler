from requests import get
from requests.exceptions import RequestException
from bs4 import BeautifulSoup
import lxml
import json


# WILL NOT ADD COURSES WITH TIME = TBA

# CONSTANTS #
EXPORT = 'classes.txt'
DELIMITER = ', '
CLASSES_URL = 'https://classes.usc.edu/term-20191/'  # THIS IS SPRING 2019
DEBUG = 5  # Debug Verbosity Scale of 0-5


class Class:
    def __init__(self, filename, course_name, prereqs, coreqs, description,
                 section, session, type, time, days, registered, instructor, location):
        self.filename = filename

        self.course_name = course_name
        self.department = None
        self.course_num = None
        self.name = None
        self.units = None
        self.course_info(course_name)  # Sets: department , course_num , name , units

        self.prereqs = self.get_requisites(prereqs)
        self.coreqs = self.get_requisites(coreqs)
        self.description = description
        self.section = section
        self.session = session
        self.type = type

        self.timeStart = None
        self.timeEnd = None
        self.get_time(time)  # Sets: timeStart , timeEnd

        self.days = self.get_days(days)  # Sets days in format: 0-0-1-0-0 -- Represents wednesday class -- m-tu-w-th-f

        self.registered = None
        self.registered_max = None
        self.parse_registered(registered)  # Sets: registered , registered_max

        self.instructor = instructor
        self.location = location

        self.instructorID = self.get_instructor_id(instructor)

    def get_instructor_id(self, name):
        if not name or name == '':
            return None
        try:
            ratings_file = open('ratings.json')
            rating_dict = json.load(ratings_file)
            ret = rating_dict[name]['id']
        except:
            return None
        finally:
            ratings_file.close()
        return ret


    def course_info(self, course):
        split = course.split(" ")
        self.department = split[0]
        self.course_num = split[1][:-1]
        course.replace(course.split(":")[0] + ":", "")
        split = course.split("(")
        self.name = split[0]
        self.units = split[1][0]

    def parse_registered(self, registered):
        split = registered.split(" of ")
        self.registered = split[0]
        self.registered_max = split[1]

    def get_days(self, days):
        ret = ""
        if len(days.split(",")) == 0:
            if "M" in days:
                ret += "1-"
            else:
                ret += "0-"
            if "Tu" in days:
                ret += "1-"
            else:
                ret += "0-"
            if "W" in days:
                ret += "1-"
            else:
                ret += "0-"
            if "Th" in days:
                ret += "1-"
            else:
                ret += "0-"
            if "F" in days:
                ret += "1"
            else:
                ret += "0"
            if ret == "":
                ret = "0-0-0-0-0"  # Probably TBA in the box
        else:
            split = days.split(",")
            for i in range(5):
                for j in split:
                    if "M" in j and i == 0:
                        ret += "1-"
                        break
                    elif i == 0:
                        ret += "0-"
                        break
                    if "Tu" in j and i == 1:
                        ret += "1-"
                        break
                    elif i == 1:
                        ret += "0-"
                        break
                    if "W" in j and i == 2:
                        ret += "1-"
                        break
                    elif i == 2:
                        ret += "0-"
                        break
                    if "Th" in j and i == 3:
                        ret += "1-"
                        break
                    elif i == 3:
                        ret += "0-"
                        break
                    if "F" in j and i == 4:
                        ret += "1"
                        break
                    elif i == 4:
                        ret += "0"
                        break
        return ret

    def get_time(self, time):
        split = time.split("-")
        isPM = time[-2] == 'p'
        if isPM:
            self.timeEnd = str(int(split[1].split(":")[0]) + 12) + ":" + split[1].split(":")[1][:-2]
            if int(split[1].split(":")[0]) > int(split[1].split(":")[0]):  # class starts in AM, ends in PM
                self.timeStart = split[0][:-2]
            else:  # class starts in PM, ends in PM
                self.timeStart = str(int(split[0].split(":")[0]) + 12) + ":" + split[0].split(":")[1]
        else:
            self.timeEnd = split[1][:-2]
            self.timeStart = split[0]


    def get_requisites(self, reqs):
        if reqs:
            return reqs.split(", ")
        else:
            return ""

    def add(self):
        try:
            file = open(self.filename, "a")
            string = ""
            if self.instructorID:
                string += "INSERT INTO Class (department, classNumber, className, units, section, sessionNum, " \
                        "typeName, timeStart, timeEnd, days, registered, registeredMax, instructor, location, info," \
                        " instructorID) VALUES ("
            else:
                string += "INSERT INTO Class (department, classNumber, className, units, section, sessionNum, " \
                          "typeName, timeStart, timeEnd, days, registered, registeredMax, instructor, location, info" \
                          ") VALUES ("
            string += "'" + self.department + "'" + DELIMITER
            string += "'" + self.course_num + "'" + DELIMITER
            string += "'" + self.name.replace("'", "\\'") + "'" + DELIMITER
            string += self.units + DELIMITER
            #string += self.prereqs + DELIMITER  # DO SOMETHING WITH THIS
            #string += self.coreqs + DELIMITER   # DO SOMETHING WITH THIS
            string += "'" + self.section + "'" + DELIMITER
            string += self.session + DELIMITER
            string += "'" + self.type + "'" + DELIMITER
            string += "'" + self.timeStart + "'" + DELIMITER
            string += "'" + self.timeEnd + "'" + DELIMITER
            string += "'" + self.days + "'" + DELIMITER
            string += self.registered + DELIMITER
            string += self.registered_max + DELIMITER
            string += "'" + self.instructor.replace("'", "\\'") + "'" + DELIMITER
            string += "'" + self.location + "'" + DELIMITER
            string += "'" + self.description.replace("'", "\\'") + "'"
            if self.instructorID:
                string += DELIMITER + str(self.instructorID) + ");\n"
            else:
                string += ");\n"
            file.write(string)
            file.flush()
            file.close()
            return True
        except:
            return False

    def __repr__(self):
        return self.department + " " + self.course_num


def get_classes(website):
    try:
        if DEBUG > 0:
            print("\tAttempting to connect to " + website)
        htmltext = get(website).content
        if DEBUG > 0:
            print("\tConnected to " + website)
    except RequestException:
        if DEBUG > 0:
            print("\tCount not connect to " + website)
        return

    soup = BeautifulSoup(htmltext, 'lxml')
    courses = soup.findAll('div', attrs={'class': 'course-info expandable'})
    if len(courses) == 0:
        if DEBUG > 1:
            print("\t\tNo classes found")
        return
    for i in courses:
        course = i.find('a', attrs={'class': 'courselink'}).text
        if DEBUG > 1:
            print("\t\tFound class " + course)

        description = i.find('div', attrs={'class': 'catalogue'}).text
        if DEBUG > 2:
            print("\t\t\tDescription: " + description)

        coreqs = i.find('li', attrs={'class': 'coreq'})
        if coreqs:
            coreqs = coreqs.find('a').text  # CHANGE TO FIND ALL!!!!!!!
        if coreqs:
            if DEBUG > 3:
                print("\t\t\tCorequisites: " + coreqs)

        prereqs = i.find('li', attrs={'class': 'prereq'})
        if prereqs:
            prereqs = prereqs.find('a').text    # CHANGE TO FIND ALL!!!!!!!
        if prereqs:
            if DEBUG > 3:
                print("\t\t\tPrerequisites: " + prereqs)

        restrictions = i.find('li', attrs={'class': 'restriction'})
        if restrictions:
            if DEBUG > 3:
                print("\t\t\tRestrictions: " + restrictions.text)

        table = i.find_all('tr')
        if DEBUG > 3:
            print("\t\t\tFound " + str(len(table)-1) + " courses")
        for j in table:
            if j.has_attr('data-section-id'):
                #### SECTION ####
                section = j.find('td', attrs={'class': 'section'})
                if section:
                    section = section.text
                else:
                    section = ""
                #### SESSION ####
                session = j.find('td', attrs={'class': 'session'})
                if session:
                    session = session.text
                else:
                    session = ""
                #### TYPE ####
                type = j.find('td', attrs={'class': 'type'})
                if type:
                    type = type.text
                else:
                    type = ""
                #### TIME ####
                time = j.find('td', attrs={'class': 'time'})
                if time:
                    time = time.text
                else:
                    time = ""
                #### DAYS ####
                days = j.find('td', attrs={'class': 'days'})
                if days:
                    days = days.text
                else:
                    days = ""
                #### REGISTERED ####
                registered = j.find('td', attrs={'class': 'registered'})
                if registered:
                    registered = registered.text
                else:
                    registered = ""
                #### INSTRUCTOR ####
                instructor = j.find('td', attrs={'class': 'instructor'})
                if instructor:
                    instructor = instructor.text
                else:
                    instructor = ""
                #### LOCATION ####
                location = j.find('td', attrs={'class': 'location'})
                if location:
                    location = location.text
                else:
                    location = ""

                if DEBUG > 3:
                    print("\t\t\t\tAttempting to add course " + section + " to " + EXPORT)
                if DEBUG > 4:
                    print("\t\t\t\t\tSection: " + section)
                if DEBUG > 4:
                    print("\t\t\t\t\tSession: " + session)
                if DEBUG > 4:
                    print("\t\t\t\t\tType: " + type)
                if DEBUG > 4:
                    print("\t\t\t\t\tTime: " + time)
                if DEBUG > 4:
                    print("\t\t\t\t\tDays: " + days)
                if DEBUG > 4:
                    print("\t\t\t\t\tRegistered: " + registered)
                if DEBUG > 4:
                    print("\t\t\t\t\tInstructor: " + instructor)
                if DEBUG > 4:
                    print("\t\t\t\t\tLocation: " + location)

                try:
                    add_course = Class(EXPORT, course, prereqs, coreqs, description,
                         section, session, type, time, days, registered, instructor, location)
                    ### ADD COURSE HERE (add_course.add())
                    if DEBUG > 3:
                        if add_course.add():
                            print("\t\t\t\tSuccessfully added course " + section + " to " + EXPORT)
                        else:
                            print("\t\t\t\tCould not add course " + section + " to " + EXPORT)
                except:
                    if DEBUG > 3:
                        print("\t\t\t\tCould not add course " + section + " to " + EXPORT)






def scrape(website):
    try:
        if DEBUG > 0:
            print("Attempting to connect to " + website)
        htmltext = get(website).content
        if DEBUG > 0:
            print("Connected to " + website)
    except RequestException:
        if DEBUG > 0:
            print("ERROR: Count not connect to " + website)
        return

    """file = open(EXPORT, "a")
    string = ""
    string += "department" + DELIMITER
    string += "course_num" + DELIMITER
    string += "name" + DELIMITER
    string += "units" + DELIMITER
    string += "prereqs" + DELIMITER
    string += "coreqs" + DELIMITER
    string += "description" + DELIMITER
    string += "section" + DELIMITER
    string += "session" + DELIMITER
    string += "type" + DELIMITER
    string += "timeStart" + DELIMITER
    string += "timeEnd" + DELIMITER
    string += "days" + DELIMITER
    string += "registered" + DELIMITER
    string += "registered_max" + DELIMITER
    string += "instructor" + DELIMITER
    string += "location\n"
    file.write(string)
    file.flush()
    file.close()"""

    soup = BeautifulSoup(htmltext, 'lxml')
    link_list = []
    for i in soup.findAll('li'):
        var = i.find('a')
        if var:
            link = var.attrs['href']
            if link and CLASSES_URL + 'classes/' in link and link not in link_list:
                link_list.append(link)  # Removing duplicates
                get_classes(link)

if __name__ == "__main__":
    scrape(website=CLASSES_URL)
