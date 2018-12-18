package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import driver.JDBCDriver;
import models.*;
import socket.*;

/**
 * Servlet implementation class ScheduleServlet
 */
@WebServlet("/ScheduleServlet")
public class ScheduleServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;
	
  /**
   * Handles schedule retrieval requests.
   */
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { 
    // Get the writer
    PrintWriter pw = response.getWriter();
    
    // Edit the response
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    
    // Get the parameter
    String email = request.getParameter("email");
    
    // Check if the parameter is null and send an error message if so
    if (email == null) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      String error = "Missing course plan email parameter.";
      pw.write(new Gson().toJson(error));
      pw.flush();
    }
    else {
      Map<String, ArrayList<DegreeClass>> schedule = JDBCDriver.getSchedule(email);
      
      // Check if the schedule can be retrieved
      if (schedule != null) {
        // Successfully retrieved the schedule
        
        // Communicate with the front-end
        response.setStatus(HttpServletResponse.SC_OK);
        String scheduleJSON = new Gson().toJson(schedule);
        pw.write(scheduleJSON);
        pw.flush();
      }
      else {
        // Failed to retrieve classes
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        String error = "Failed to retrieve course plan for " + email + " from the database.";
        pw.write(new Gson().toJson(error));
        pw.flush();
      }
    }
  }
  
  /**
   * Handles schedule update requests.
   */
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // Get the writer
    PrintWriter pw = response.getWriter();
    
    // Edit the response
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    
    // Get all of the main parameters
    String profileEmail = request.getParameter("profileEmail");
    String action = request.getParameter("action");
    
    // Check if the parameters are null and send an error message if so
    if (profileEmail == null || action == null) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      String error = "Missing parameters to update course plan.";
      pw.write(new Gson().toJson(error));
      pw.flush();
    }
    else {
      // Only allow the logged in user to make changes to his/her schedule
      if (profileEmail.equals((String)request.getSession().getAttribute("email"))) {
        // Get the remaining parameters
        String className = request.getParameter("className");
        String term = request.getParameter("term");
        
        // Check if the parameters are null and send an error message if so
        if (className == null || term == null) {
          response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
          String error = "Missing class name and/or term parameters to update course plan.";
          pw.write(new Gson().toJson(error));
          pw.flush();
        }
        else {
          // Add a class
          if (action.equals("add")) {
            // Attempt to add the class
            if (JDBCDriver.addClassToSchedule(profileEmail, className, term)) {
              // Successfully added the class
              response.setStatus(HttpServletResponse.SC_OK);
              String success = "Successfully added " 
                  + term + ": " + className 
                  + " to " + profileEmail + "'s course plan.";
              pw.write(new Gson().toJson(success));
              pw.flush();
              ServerSocket.broadcast();
            }
            else {
              // Unable to add the class
              response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
              String error = "Failed to add " 
                  + term + ": " + className 
                  + " to " + profileEmail + "'s course plan.";
              pw.write(new Gson().toJson(error));
              pw.flush();
            }
          }
          // Remove a class
          else if (action.equals("remove")) {
            // Attempt to remove the class
            if (JDBCDriver.removeClassFromSchedule(profileEmail, className, term)) {
              // Successfully removed the class
              response.setStatus(HttpServletResponse.SC_OK);
              String success = "Successfully removed " 
                  + term + ": " + className 
                  + " from " + profileEmail + "'s course plan.";
              pw.write(new Gson().toJson(success));
              pw.flush();
              ServerSocket.broadcast();
            }
            else {
              // Unable to remove the class
              response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
              String error = "Failed to remove " 
                  + term + ": " + className 
                  + " from " + profileEmail + "'s course plan.";
              pw.write(new Gson().toJson(error));
              pw.flush();
            }
          }
        }
      }
      else {
        // Other users should not be updating schedules on other's profile pages so send an error message
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        String error = "Permission denied to edit another user's course plan.";
        pw.write(new Gson().toJson(error));
        pw.flush();
      }
    }
  }

}
