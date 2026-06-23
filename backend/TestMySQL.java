import java.sql.*;
public class TestMySQL {
  public static void main(String[] args) throws Exception {
    String url = "jdbc:mysql://localhost:3306/?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    Connection conn = DriverManager.getConnection(url, "root", "root");
    System.out.println("OK");
    conn.close();
  }
}
