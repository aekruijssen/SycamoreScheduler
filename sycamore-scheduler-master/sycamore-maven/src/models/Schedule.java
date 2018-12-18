package models;

import java.util.ArrayList;
import java.util.Vector;

public class Schedule extends ArrayList<Vector<DegreeClass>> {

    private int firstYear, firstTerm; // firstTerm \in {1: spring, 2: summer, 3: fall}
    private int numTerms;

    public Schedule ( ) {
        super(8); // default 8 terms in a standard course plan 
        this.firstYear = 2017;
        this.firstTerm = 3;  // default is fall of 2017
        this.numTerms = 8;
    }

    public Schedule(int fy, int ft, int nt) {
        super(nt); // super has to be first
        this.firstYear = fy;
        this.firstTerm = ft;
        this.numTerms = nt; // store the number of terms anyway
    }

    /* 
        Adds a class to the specified term index 
        [assumes an 8 term course plan for now]
        @param termIndex: not null, between 0 and 8
        @param classAdded: not null, could be any class
    */ 
    public void addClass(int termIndex, DegreeClass classAdded) {
        this.get(termIndex).add(classAdded);
        System.out.println("Added "+classAdded.longName+" to term #"+termIndex+"\nNew schedule:\n"+this.toString());
    }

    public void removeClass(int termIndex, DegreeClass classRemoved) {
        this.get(termIndex).remove(classRemoved);
        System.out.println("Removed "+classRemoved.longName+" from term #"+termIndex+"\nNew schedule:\n"+this.toString());
    }

    @Override
    public String toString ( ) {
        String str = "";
        int year = this.firstYear;
        int term = this.firstTerm;
        for (int i = 0; i < this.numTerms; i++) {
            str += year + '-' + term + '\n';
            str += "------------------------"+'\n';
            for (int j = 0; j < this.get(i).size(); j++) {
                DegreeClass dc = this.get(i).get(j);
                str += (j+1)+".\t"+dc.longName+'\t'+dc.className+'\n';
            }
            str += "\n\n";
        }
        return str;
    }
}