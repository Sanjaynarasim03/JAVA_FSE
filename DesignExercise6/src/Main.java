import java.util.HashMap;
import java.util.Map;

interface Image {
    void display();
}

class RealImage implements Image {
    private final String fileName;

    RealImage(String fileName) {
        this.fileName = fileName;
        loadFromServer();
    }

    private void loadFromServer() {
        System.out.println("Loading image from remote server: " + fileName);
    }

    public void display() {
        System.out.println("Displaying image: " + fileName);
    }
}

class ProxyImage implements Image {
    private final String fileName;
    private static final Map<String, RealImage> CACHE = new HashMap<>();

    ProxyImage(String fileName) {
        this.fileName = fileName;
    }

    public void display() {
        RealImage realImage = CACHE.get(fileName);
        if (realImage == null) {
            realImage = new RealImage(fileName);
            CACHE.put(fileName, realImage);
        }
        realImage.display();
    }
}

public class Main {
    public static void main(String[] args) {
        Image image1 = new ProxyImage("banner.png");
        Image image2 = new ProxyImage("banner.png");

        image1.display();
        image2.display();
    }
}
