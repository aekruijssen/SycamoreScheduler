package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import driver.JDBCDriver;

/**
 * Servlet implementation class ClassesServlet
 */
@WebServlet("/ClassesServlet")
public class ClassesServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;
  
  /**
   * Handles requests for classes.
   */
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // Get the writer
    PrintWriter pw = response.getWriter();
    
    // Edit the response
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    
    // Get the parameter
    String degreeProgramName = request.getParameter("degreeProgramName");
    
    // Check if the parameter is null and send an error message if so
    if (degreeProgramName == null) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      String error = "Missing degree program name.";
      pw.write(new Gson().toJson(error));
      pw.flush();
    }
    else {
      ArrayList<ArrayList<String>> classes = JDBCDriver.getClasses(degreeProgramName);
      
      // Check if the classes can be retrieved
      if (classes != null) {
        // Successfully retrieved the classes
        
        // Communicate with the front-end
        response.setStatus(HttpServletResponse.SC_OK);
        String classesJSON = new Gson().toJson(classes);
        pw.write(classesJSON);
        pw.flush();
      }
      else {
        // Failed to retrieve classes
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        String error = "Failed to get classes for " + degreeProgramName + " from the database.";
        pw.write(new Gson().toJson(error));
        pw.flush();
      }
    }
  }

}
