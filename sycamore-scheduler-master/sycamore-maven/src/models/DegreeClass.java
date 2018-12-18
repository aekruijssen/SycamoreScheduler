package models;

public class DegreeClass {
    public double instructorRating;
	public int degreeClassID, rmpID, units;
	public String degreeName, classNumber, className, instructorName, summary, longName;

	public DegreeClass (int id, String degname, String num, String classname, int units,
		String instructor, int instructorid, String info, double rating) {
		this.degreeClassID = id;
		this.rmpID = instructorid;
		this.units = units;
		this.degreeName = degname;
		this.classNumber = num;
		this.className = classname;
		this.instructorName = instructor;
        this.summary = info;
        this.longName = this.degreeName + " " + this.classNumber;
        this.instructorRating = rating;
	}

	@Override
	public String toString() {
		String str = "";
		str +="ID: "+this.degreeClassID+", UNITS: "+this.units+'\n'
			+"-------------------------"+'\n'
			+'\t'+this.degreeName+" "+this.classNumber+'\n'
			+'\t'+this.className+'\n'
			+'\t'+this.instructorName+" ("+this.rmpID+")"+ " RATING="+this.instructorRating+'\n';
		return str;
	}
}