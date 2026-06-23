import java.sql.*;
public class InspectDb {
  public static void main(String[] args) throws Exception {
    String url = "jdbc:mysql://localhost:3306/heatmap_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    try (Connection conn = DriverManager.getConnection(url, "root", "root")) {
      Statement st = conn.createStatement();
      ResultSet rs = st.executeQuery("SELECT id, username, email FROM users");
      while (rs.next()) {
        System.out.println(rs.getLong(1) + " | " + rs.getString(2) + " | " + rs.getString(3));
      }
      rs = st.executeQuery("SELECT id, name FROM roles");
      while (rs.next()) {
        System.out.println("ROLE " + rs.getLong(1) + " | " + rs.getString(2));
      }
    }
  }
}
