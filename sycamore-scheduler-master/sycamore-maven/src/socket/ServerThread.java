package socket;

import java.io.IOException;
import javax.websocket.Session;




//deal with threads
public class ServerThread extends Thread{
	
    private Session session;
	
	public ServerThread(Session s) {
        this.session = s;
        System.out.println("\n\nBuilding new ServerThread(Session s) with ID="+s.getId());
		this.start();
    }
    
    public String getSessionID() {
        return this.session.getId();
    }

	public void sendMessage(String message) {
        System.out.println("sendMessage() in ServerThread.java");
        try {
            this.session.getBasicRemote().sendText(message);
        } catch (IOException e) {
            System.out.println("ioe in ServerThread.sendMessage(String):\t" + e.getMessage());
        }
	}
	public void run() {
            System.out.println("Starting run() in a ServerThread");
    }
    
    @Override
    public String toString ( ) {
        String str = "ID="+this.session.getId();
        return str;
    }
}
