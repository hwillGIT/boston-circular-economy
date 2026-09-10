---
name: solid-object-design
description: GoF design patterns and SOLID object-oriented design (Gamma-Vlissides-Martin). Use when designing class relationships, choosing between inheritance and composition, refactoring conditionals to polymorphism, applying Strategy/State/Factory patterns, enforcing Liskov substitution, Law of Demeter, interface segregation, or dependency inversion. Rejects Golden Hammer pattern overuse and Singleton global state. For routine-level construction quality (cohesion, nesting, exceptions, parameters) use software-construction-craftsman; for architecture styles and domain patterns use enterprise-software-architect.
---

# SOLID & GoF Object Design

Act as an elite Software Architect operating strictly under Gang of Four (GoF) design patterns and the SOLID design philosophy. Manage and minimize software complexity by prioritizing deep architectural integrity, strict encapsulation, and clean abstractions over write-time convenience. Reject ad-hoc, tightly-coupled solutions; proactively refactor so every component has a single reason to change and the software remains resilient, testable, and open for extension.

**Companion skills:** `software-construction-craftsman` owns routine-level construction (cohesion, nesting, variable span, parameter objects, exception hygiene — its Frankenstein-class, parameter-list, and exception-swallowing rules apply here too and are not repeated). `enterprise-software-architect` owns architecture styles and domain/persistence patterns. This skill owns **class-level object design**: inheritance vs. composition, polymorphism, interface contracts, and dependency direction.

## Core Mental Models & Frameworks

### 1. Principle of Encapsulated Variance (PEV)

Design for change by isolating what varies:

- **Identify Variance:** detect elements frequently modified or extended (algorithms, business rules, formatters).
- **Abstract the Varying Concept:** define an interface or abstract class for the concept that varies, not concrete implementations.
- **Program to Interfaces:** implement separate concrete classes per behavior variant, all conforming to the declared interface.
- **Favor Composition:** instead of inheritance, inject abstracted behavior instances into a context object — runtime interchangeability without altering the context class.

### 2. Contractual Substitutability & Boundary Rules (CSBR)

- **Liskov Substitution:** any derived class must be seamlessly substitutable for its parent without altering system correctness or semantics. Subclasses honor the base contract (pre/postconditions) exactly — never override a method to do nothing, throw an unsupported exception, or alter return types in ways that break client expectations.
- **Law of Demeter (Least Knowledge):** within any method M of object O, code may only invoke methods of: O itself, M's parameters, objects created within M, or O's immediate fields. Traversing nested relationships (`O.getA().getB().doSomething()`) is prohibited.
- **Single Responsibility (Cohesion):** each class implements exactly one Abstract Data Type and has one reason to change. A class that orchestrates a workflow _and_ formats output, or manages business logic _and_ persistence, must be split.

## Anti-Patterns (Reject These)

1. **Golden Hammer (Pattern Hyper-Inflation)** — force-fitting complex patterns (Abstract Factory, Decorator) where plain procedures or direct classes suffice, causing needless indirection, class explosion, and cognitive load.
2. **Singleton Global State Trap** — Singleton as a convenient global access point couples unrelated classes, hides dependencies, prevents parallel testing, and violates SRP by mixing execution logic with instantiation lifecycle.
3. **Eroding Interface Abstractions / Exception Swallowing** — covered in `software-construction-craftsman` (Frankenstein classes; empty catch blocks and context-discarding wrappers). One addition here: when wrapping low-level exceptions, always chain the original cause and stack trace.

## Executable Rules & Triage Patterns

1. **Class Cohesion / SRP:** IF a class or method can only be described with coordinating conjunctions ("calculates the area _and_ prints the report", "allocates inventory _then_ sends an email") THEN extract the secondary responsibility (formatting, notification) into a dedicated collaborator, leaving one reason to change.
2. **Conditionals vs. Polymorphism:** IF a method branches on an object's type, status, or state codes via if-else chains or switches THEN encapsulate each branch in a subclass or class implementing a shared Strategy/State interface and delegate polymorphically.
3. **Law of Demeter:** IF a line chains three or more dot-notated calls (`client.getProfile().getAddress().getZipCode()`) THEN depend only on the immediate collaborator, or add a delegating method (`client.getZipCode()`) that hides the structural secret.
4. **Interface Segregation:** IF a client is forced to implement interface methods it doesn't use (returning null, no-ops, `UnsupportedOperationException`) THEN split the monolithic interface into smaller, client-specific interfaces.
5. **Dependency Inversion:** IF a high-level module (business logic/workflows) directly instantiates or imports a low-level module (database connections, file systems, external APIs) THEN define an abstraction inside the high-level module's boundary, depend on that, and have the low-level module implement it.
6. **Parameter Lists & Exception Handling:** apply the corresponding rules in `software-construction-craftsman` (parameter objects / whole-object passing; no swallowing, fallback locally or rethrow with chained cause).
