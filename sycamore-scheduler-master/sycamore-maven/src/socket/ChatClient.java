package socket;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import driver.JDBCDriver;

public class ChatClient extends Thread {

	public  String line;
	public String user;
	
	private BufferedReader br;
	
	public ChatClient (BufferedWriter bw, BufferedReader br) {
		this.br = br;
		System.out.println("Connected! [ in ChatClient() ]");
		this.start();
	}
	public void run() {
		try {
			while(true) {
				//String line = br.readLine();
				//System.out.println(line);
				String info = br.readLine();
				
				// Get all of the main parameters
				String [] infoArr = info.split(",");
			    String profileEmail = infoArr[0];
			    String action = infoArr[3];
			    
			    // Check if the parameters are null and send an error message if so
			    
			 //   if (profileEmail == null || action == null) {
			 //     response.sendError(HttpServletResponse.SC_BAD_REQUEST, 
			 //         "Missing parameters to update schedule.");
			 //   }
			 //   else {
			      // Only allow the logged in user to make changes to his/her schedule
			    //  if (profileEmail.equals((String)request.getSession().getAttribute("email"))) {
			        // Get the remaining parameters
			        String className = infoArr[1];
			        String term = infoArr[2];
			        
			        // Check if the parameters are null and send an error message if so
			 //       if (className == null || term == null) {
			 //         response.sendError(HttpServletResponse.SC_BAD_REQUEST, 
			 //             "Missing class name and/or term parameters to update schedule.");
			 //       }
			 //       else {
			          // Add a class
			          if (action.equals("add")) {
			            // Attempt to add the class
			 //           if (
			            	JDBCDriver.addClassToSchedule(profileEmail, className, term); 
			 //		{
			              // Successfully added the class
			 //             response.setStatus(HttpServletResponse.SC_OK);
			 //           }
			 //           else {
			              // Unable to add the class
			 //             response.sendError(HttpServletResponse.SC_BAD_REQUEST, 
			 //                 "Failed to add " + term + ": " + className + " for " + profileEmail + " to database.");
			            }
			 //         }
			          // Remove a class
			          else if (action.equals("remove")) {
			            // Attempt to remove the class
			 //           if (
			            	JDBCDriver.removeClassFromSchedule(profileEmail, className, term); 
			//	{
			              // Successfully removed the class
			 //             response.setStatus(HttpServletResponse.SC_OK);
			            }
			 //           else {
			              // Unable to remove the class
			 //             response.sendError(HttpServletResponse.SC_BAD_REQUEST, 
			 //                 "Failed to remove " + term + ": " + className + " for " + profileEmail + " from database.");
			 //           }
			          }
			    //    }
			    //  }
				
		}catch(IOException ioe) {
			System.out.println("ioe in run: " + ioe.getMessage());
	   }
	}
}
