import json

if __name__ == "__main__":
    outfile = open("instructors.txt", "w")
    rating_dict = json.load(open('ratings.json'))
    instructorID = 0
    instructorName = ""
    rating = 0.0
    for key in rating_dict:
        instructorName = str(key).replace("\"", "\\\"")
        instructorID = int(rating_dict[key]['id'])
        try:
            rating = float(rating_dict[key]['rating'])
        except:
            pass
        outfile.write("INSERT INTO Instructor(instructorID, instructorName, rmpRating) VALUES (" + str(instructorID) +
                      ", \"" + instructorName + "\", " + str(rating) + ");\n")
        outfile.flush()
    outfile.close()
