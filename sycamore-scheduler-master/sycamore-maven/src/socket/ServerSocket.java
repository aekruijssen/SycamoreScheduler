package socket;

import java.util.Vector;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;


@ServerEndpoint("/ss1")
public class ServerSocket {
    // static so that ServerSocket functions like a singleton WebSocket utility class
    private static Vector<ServerThread> threads = new Vector<ServerThread>(); 

	public ServerSocket(){
        
	}
	
	@OnOpen
	public void open(Session session) {
        System.out.println("Connection made! ID=" + session.getId());
		ServerThread st = new ServerThread(session);
        threads.add(st);
        System.out.println("Threads after connect:\n"+threads.toString()+"\n");
	}
	
	@OnMessage
	public void onMessage(String message, Session session) {
        System.out.println("Message! ID=" + session.getId()+"\tMESSAGE="+message);
        System.out.println("Threads after message:\n"+threads.toString()+"\n");

	}
	
	
	@OnClose
	public void close(Session session) {
        System.out.println("Disconnecting! ID=" + session.getId());
        for (int i = 0; i < threads.size(); i++) {
            if (threads.get(i).getSessionID().equals(session.getId())) {
                threads.remove(i);
            }
        }
        System.out.println("Threads after remove:\n"+threads.toString()+"\n");
	}
	
	@OnError
	public void error(Throwable error) {
		System.out.println("Error!");
	}
	
	public static void broadcast() {
        System.out.println("in broadcast");
        for (ServerThread thread: threads) {
            thread.sendMessage("you should fetch updates from the server");
        }
	}	
}