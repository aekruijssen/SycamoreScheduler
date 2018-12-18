package controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

/**
 * Servlet implementation class LogoutServlet
 */
@WebServlet("/LogoutServlet")
public class LogoutServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;
  
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // Get the writer
    PrintWriter pw = response.getWriter();
    
    // Edit the response
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    
    // Set the email session attribute to null
    request.getSession().setAttribute("email", null);
    
    // Communicate with the front-end after email is null
    if (request.getSession().getAttribute("email") == null) {
      response.setStatus(HttpServletResponse.SC_OK);
      String success = "Successfully logged out the user.";
      pw.write(new Gson().toJson(success));
      pw.flush();
    }
    else {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      String error = "Failed to log out the user.";
      pw.write(new Gson().toJson(error));
      pw.flush();
    }
  }
  
}
