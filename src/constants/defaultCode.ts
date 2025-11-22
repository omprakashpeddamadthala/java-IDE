export const DEFAULT_JAVA_CODE = `class Employee {
    private String name;
    private String role;
    private double salary;

    public Employee(String name, String role, double salary) {
        this.name = name;
        this.role = role;
        this.salary = salary;
    }

    public void displayInfo() {
        System.out.println("┌─────────────────────────────────────────┐");
        System.out.println("│ Employee Information                    │");
        System.out.println("├─────────────────────────────────────────┤");
        System.out.printf("│ Name:   %-31s │%n", name);
        System.out.printf("│ Role:   %-31s │%n", role);
        System.out.printf("│ Salary: $%-30.2f │%n", salary);
        System.out.println("└─────────────────────────────────────────┘");
    }

    public void work() {
        System.out.println("\\n" + name + " is working as a " + role);
    }

    public double getSalary() {
        return salary;
    }

    public String getName() {
        return name;
    }
}

class Manager extends Employee {
    private int teamSize;

    public Manager(String name, double salary, int teamSize) {
        super(name, "Manager", salary);
        this.teamSize = teamSize;
    }

    @Override
    public void work() {
        System.out.println("\\n👔 " + getName() + " is managing a team of " + teamSize + " people");
        System.out.println("   • Conducting team meetings");
        System.out.println("   • Reviewing performance");
        System.out.println("   • Planning projects");
    }
}

class Developer extends Employee {
    private String programmingLanguage;

    public Developer(String name, double salary, String language) {
        super(name, "Developer", salary);
        this.programmingLanguage = language;
    }

    @Override
    public void work() {
        System.out.println("\\n💻 " + getName() + " is coding in " + programmingLanguage);
        System.out.println("   • Writing clean code");
        System.out.println("   • Debugging issues");
        System.out.println("   • Code reviews");
    }
}

class Designer extends Employee {
    private String designTool;

    public Designer(String name, double salary, String tool) {
        super(name, "Designer", salary);
        this.designTool = tool;
    }

    @Override
    public void work() {
        System.out.println("\\n🎨 " + getName() + " is designing using " + designTool);
        System.out.println("   • Creating mockups");
        System.out.println("   • User research");
        System.out.println("   • Design systems");
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("╔═══════════════════════════════════════════════════╗");
        System.out.println("║     EMPLOYEE MANAGEMENT SYSTEM - DEMO v1.0        ║");
        System.out.println("╚═══════════════════════════════════════════════════╝");
        System.out.println();

        Manager manager = new Manager("Sarah Johnson", 95000, 8);
        Developer dev1 = new Developer("Alex Chen", 85000, "Java");
        Developer dev2 = new Developer("Priya Sharma", 82000, "Python");
        Designer designer = new Designer("Michael Brown", 78000, "Figma");

        manager.displayInfo();
        dev1.displayInfo();
        dev2.displayInfo();
        designer.displayInfo();

        System.out.println("\\n" + "=".repeat(50));
        System.out.println("         DAILY WORK ACTIVITIES");
        System.out.println("=".repeat(50));

        manager.work();
        dev1.work();
        dev2.work();
        designer.work();

        System.out.println("\\n" + "=".repeat(50));
        System.out.println("         SALARY SUMMARY");
        System.out.println("=".repeat(50));

        double totalSalary = manager.getSalary() + dev1.getSalary() +
                           dev2.getSalary() + designer.getSalary();

        System.out.printf("\\nTotal Monthly Payroll: $%.2f%n", totalSalary);
        System.out.printf("Average Salary: $%.2f%n", totalSalary / 4);

        System.out.println("\\n✅ System Demo Complete!");
    }
}`;
