package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import driver.JDBCDriver;

/**
 * Servlet implementation class ProfileServlet
 */
@WebServlet("/ProfileServlet")
public class ProfileServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;
  
  /**
   * Handles profile retrieval requests.
   */
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // Get the writer
    PrintWriter pw = response.getWriter();
    
    // Edit the response
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    
    // Get the parameter
    String profileEmail = request.getParameter("profileEmail");
    
    // Check if the parameter is null and send an error message if so
    if (profileEmail == null) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      String error = "Email parameter for profile is missing.";
      pw.write(new Gson().toJson(error));
      pw.flush();
    }
    else {
      // Attempt to retrieve user's information
      Map<String, String> userInformation = JDBCDriver.getUserInformation(profileEmail);
      
      // Check if the user information
      if (userInformation != null) {
        // Successfully retrieved the user's information
        
        // Communicate with the front-end
        String userInformationJSON = new Gson().toJson(userInformation);
        response.setStatus(HttpServletResponse.SC_OK);
        pw.write(userInformationJSON);
        pw.flush();
      }
      else {
        // Failed to retrieve the user's information
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        String error = "Failed to retrieve user's information from the database.";
        pw.write(new Gson().toJson(error));
        pw.flush();
      }
    }
  }
  
  /**
   * Handles profile update requests.
   */
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // Get the writer
    PrintWriter pw = response.getWriter();
    
    // Edit the response
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    
    // Get the main parameters
    String profileEmail = request.getParameter("profileEmail");
    String action = request.getParameter("action");
    
    // Check if the parameters are null and send an error message if so
    if (profileEmail == null || action == null) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      String error = "Missing profile update parameters.";
      pw.write(new Gson().toJson(error));
      pw.flush();
    }
    else {
      // Only allow the logged in user to make changes to his/her profile
      if (profileEmail.equals((String)request.getSession().getAttribute("email"))) {
        // Update or remove the user's degree program
        if (action.equals("updateDegreeProgram") || action.equals("removeDegreeProgram")) {
          // Get the remaining parameters
          String degreeProgramName = request.getParameter("degreeProgramName");
          // Category can be: primaryMajor, secondaryMajor, primaryMinor, or secondaryMinor
          String category = request.getParameter("category");
          
          // Check if the parameters are null and send an error message if so
          if (degreeProgramName == null || category == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Missing parameters to update or remove degree program.";
            pw.write(new Gson().toJson(error));
            pw.flush();
          }
          else {
            // Update the user's degree program
            if (action.equals("updateDegreeProgram")) {
              // Attempt to update the user's degree program
              if (JDBCDriver.updateDegreeProgram(profileEmail, degreeProgramName, category)) {
                // Successfully updated the user's degree program
                response.setStatus(HttpServletResponse.SC_OK);
                String success = "Successfully updated the user's degree program";
                pw.write(new Gson().toJson(success));
                pw.flush();
              }
              else {
                // Unable to update the user's degree program
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Failed to update the user's degree program.";
                pw.write(new Gson().toJson(error));
                pw.flush();
                
              }
            }
            // Remove the user's degree program
            else if (action.equals("removeDegreeProgram")) {
              // Unable to remove primary major
              if (category.equals("primary major")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Unable to remove the user's primary major.";
                pw.write(new Gson().toJson(error));
                pw.flush();
              }
              // Valid category to remove
              else {
                // Attempt to remove the user's degree program
                if (JDBCDriver.removeDegreeProgram(profileEmail, category)) {
                  // Successfully remove the user's degree program
                  response.setStatus(HttpServletResponse.SC_OK);
                  String success = "Successfully removed the user's degree program.";
                  pw.write(new Gson().toJson(success));
                  pw.flush();
                }
                else {
                  // Unable to remove the user's degree program
                  response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                  String error = "Failed to remove " + category 
                      + " from " + profileEmail + "'s database.";
                  pw.write(new Gson().toJson(error));
                  pw.flush();
                }
              }   
            }
          }
        }
        // Update the user's password
        else if (action.equals("updatePassword")) {
          // Get the remaining parameters
          String oldPassword = request.getParameter("oldPassword");
          String newPassword = request.getParameter("newPassword");
          
          // Check if the parameters are null and send an error message if so
          if (oldPassword == null || newPassword == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Missing password update parameters.";
            pw.write(new Gson().toJson(error));
            pw.flush();
          }
          else {
            // Attempt to update the user's password
            if (JDBCDriver.updatePassword(profileEmail, oldPassword, newPassword)) {
              // Successfully updated the user's password
              response.setStatus(HttpServletResponse.SC_OK);
              String success = "Successfully updated the user's password.";
              pw.write(new Gson().toJson(success));
              pw.flush();
            }
            else {
              // Unable to update the user's password
              response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
              String error = "Failed to udpate " + profileEmail + "'s password in the database.";
              pw.write(new Gson().toJson(error));
              pw.flush();
            }
          }
        }
      }
      else {
        // Other users should not be updating another user's profile so send an error message
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        String error = "Permission denied to update another user's profile.";
        pw.write(new Gson().toJson(error));
        pw.flush();
      }
    }
  }

}
