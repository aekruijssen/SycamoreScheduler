package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import driver.JDBCDriver;

/**
 * Servlet implementation class RegisterServlet
 */
@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;
  
  /**
   * Handles user registration requests to display all degree programs.
   */
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // Get the writer
    PrintWriter pw = response.getWriter();
    
    // Edit the response
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    
    // Attempt to retrieve all of the degree program names
    Map<String, ArrayList<String>> degreeProgramNames = JDBCDriver.getAllDegreePrograms();
    
    if (degreeProgramNames != null) {
      // Successfully retrieved all of the degree program names
      
      // Communicate with the front-end
      String degreeProgramNamesJSON = new Gson().toJson(degreeProgramNames);
      response.setStatus(HttpServletResponse.SC_OK);
      pw.write(degreeProgramNamesJSON);
      pw.flush();
    }
    else {
      // Failed to retrieve all of the degree program names
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      String error = "Failed to retrieve all of the degree program names from the database.";
      pw.write(new Gson().toJson(error));
      pw.flush();
    }
  }
  
  /**
   * Handles user registration requests.
   */
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	  System.out.println("POST RegisterServlet");
    // Get the writer
    PrintWriter pw = response.getWriter();
    
    // Edit the response
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    String email = request.getParameter("email");
    String fName = request.getParameter("fName");
    String lName = request.getParameter("lName");
    String password = request.getParameter("password");
    String major1 = request.getParameter("major1");
    String major2 = request.getParameter("major2");
    String minor1 = request.getParameter("minor1");
    String minor2 = request.getParameter("minor2");
    	  
    // Check if any of the parameters are null and send an error message if so
    // At minimum, major1 must have a value
    if (email == null || fName == null || lName == null || password == null || major1 == null) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      Map<String, String> error = new HashMap<String, String>();
      error.put("error", "Missing registration parameters.");
      pw.write(new Gson().toJson(error));
      pw.flush();
    }
    else {
      // Add the degree program names to the academicPrograms list
      ArrayList<String> academicPrograms = new ArrayList<String>();
      academicPrograms.add(major1); // At this point we know major1 is not null
      academicPrograms.add(major2);
      academicPrograms.add(minor1);
      academicPrograms.add(minor2);
	    
      // Attempt to register the user
      if (JDBCDriver.addUser(email, fName, lName, password, academicPrograms)) {
        // Successfully registered user
        
        // Store the email as a session attribute
        request.getSession().setAttribute("email", email);
        
        // Communicate with the front-end
        response.setStatus(HttpServletResponse.SC_OK);
        Map<String, String> success = new HashMap<String, String>();
        success.put("success", "Successfully registered the user in the database.");
        pw.write(new Gson().toJson(success));
        pw.flush();
      }
      else {
        // Failed to register user
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        Map<String, String> error = new HashMap<String, String>();
        error.put("error", "Sorry, " + email + " is already in use.");
        pw.write(new Gson().toJson(error));
        pw.flush();
      }
    }
  }

}
