class Computer {
    private final String cpu;
    private final int ramGb;
    private final int storageGb;
    private final boolean gpuEnabled;
    private final boolean bluetoothEnabled;

    private Computer(Builder builder) {
        this.cpu = builder.cpu;
        this.ramGb = builder.ramGb;
        this.storageGb = builder.storageGb;
        this.gpuEnabled = builder.gpuEnabled;
        this.bluetoothEnabled = builder.bluetoothEnabled;
    }

    public static class Builder {
        private String cpu;
        private int ramGb;
        private int storageGb;
        private boolean gpuEnabled;
        private boolean bluetoothEnabled;

        public Builder setCpu(String cpu) {
            this.cpu = cpu;
            return this;
        }

        public Builder setRamGb(int ramGb) {
            this.ramGb = ramGb;
            return this;
        }

        public Builder setStorageGb(int storageGb) {
            this.storageGb = storageGb;
            return this;
        }

        public Builder setGpuEnabled(boolean gpuEnabled) {
            this.gpuEnabled = gpuEnabled;
            return this;
        }

        public Builder setBluetoothEnabled(boolean bluetoothEnabled) {
            this.bluetoothEnabled = bluetoothEnabled;
            return this;
        }

        public Computer build() {
            return new Computer(this);
        }
    }

    @Override
    public String toString() {
        return "Computer{cpu='" + cpu + "', ramGb=" + ramGb + ", storageGb=" + storageGb
                + ", gpuEnabled=" + gpuEnabled + ", bluetoothEnabled=" + bluetoothEnabled + "}";
    }
}

public class Main {
    public static void main(String[] args) {
        Computer gamingPc = new Computer.Builder()
                .setCpu("Intel i9")
                .setRamGb(32)
                .setStorageGb(1024)
                .setGpuEnabled(true)
                .setBluetoothEnabled(true)
                .build();

        Computer officePc = new Computer.Builder()
                .setCpu("Intel i5")
                .setRamGb(16)
                .setStorageGb(512)
                .setGpuEnabled(false)
                .setBluetoothEnabled(true)
                .build();

        System.out.println(gamingPc);
        System.out.println(officePc);
    }
}
