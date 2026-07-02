import java.util.ArrayList;
import java.util.List;

interface Stock {
    void registerObserver(Observer observer);
    void deregisterObserver(Observer observer);
    void notifyObservers();
}

interface Observer {
    void update(String stockName, double price);
}

class StockMarket implements Stock {
    private final List<Observer> observers = new ArrayList<>();
    private String stockName;
    private double price;

    public void setStockData(String stockName, double price) {
        this.stockName = stockName;
        this.price = price;
        notifyObservers();
    }

    public void registerObserver(Observer observer) {
        observers.add(observer);
    }

    public void deregisterObserver(Observer observer) {
        observers.remove(observer);
    }

    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(stockName, price);
        }
    }
}

class MobileApp implements Observer {
    private final String user;

    MobileApp(String user) {
        this.user = user;
    }

    public void update(String stockName, double price) {
        System.out.println("MobileApp(" + user + "): " + stockName + " -> " + price);
    }
}

class WebApp implements Observer {
    private final String user;

    WebApp(String user) {
        this.user = user;
    }

    public void update(String stockName, double price) {
        System.out.println("WebApp(" + user + "): " + stockName + " -> " + price);
    }
}

public class Main {
    public static void main(String[] args) {
        StockMarket market = new StockMarket();

        Observer mobile = new MobileApp("Alice");
        Observer web = new WebApp("Bob");

        market.registerObserver(mobile);
        market.registerObserver(web);

        market.setStockData("INFY", 1520.75);
        market.setStockData("TCS", 3810.25);

        market.deregisterObserver(web);
        market.setStockData("HDFCBANK", 1665.10);
    }
}
