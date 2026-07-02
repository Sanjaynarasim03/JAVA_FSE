class Student {
    private String name;
    private String id;
    private String grade;

    Student(String name, String id, String grade) {
        this.name = name;
        this.id = id;
        this.grade = grade;
    }

    String getName() {
        return name;
    }

    void setName(String name) {
        this.name = name;
    }

    String getId() {
        return id;
    }

    void setId(String id) {
        this.id = id;
    }

    String getGrade() {
        return grade;
    }

    void setGrade(String grade) {
        this.grade = grade;
    }
}

class StudentView {
    void displayStudentDetails(String name, String id, String grade) {
        System.out.println("Student Details: " + name + ", " + id + ", " + grade);
    }
}

class StudentController {
    private final Student model;
    private final StudentView view;

    StudentController(Student model, StudentView view) {
        this.model = model;
        this.view = view;
    }

    void setStudentName(String name) {
        model.setName(name);
    }

    void setStudentId(String id) {
        model.setId(id);
    }

    void setStudentGrade(String grade) {
        model.setGrade(grade);
    }

    void updateView() {
        view.displayStudentDetails(model.getName(), model.getId(), model.getGrade());
    }
}

public class Main {
    public static void main(String[] args) {
        Student student = new Student("Sanjay", "STU101", "A");
        StudentView view = new StudentView();
        StudentController controller = new StudentController(student, view);

        controller.updateView();
        controller.setStudentGrade("A+");
        controller.updateView();
    }
}
