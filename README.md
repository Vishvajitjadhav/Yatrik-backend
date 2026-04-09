# 🚀 Yatrik – Scalable Hotel Booking Backend

Backend system for a production-grade hotel & property booking platform inspired by Airbnb, designed with a focus on scalability, transactional integrity, and real-world backend challenges.

---

## 🧠 System Overview

**Yatrik** is built from scratch to simulate a real-world booking platform where multiple users interact concurrently with inventory, pricing, and payments.

The system emphasizes:
- Strong domain modeling
- Concurrency-safe booking workflows
- Extensible pricing strategies
- Secure payment processing
- Clean, layered, and maintainable architecture

---

## 🏗️ Tech Stack

- Java 21
- Spring Boot
- Spring Data JPA + Hibernate
- PostgreSQL
- JWT Authentication
- Stripe Payment Gateway
- Swagger (OpenAPI)
- Postman (API Testing)
- DBeaver (DB Management)

---

## ⚙️ Key Engineering Highlights

### 🔹 1. Built From Scratch (End-to-End Ownership)
- Led complete development lifecycle:
    - Requirement gathering
    - Schema & ER design
    - API contract design
- Designed the system with scalability and extensibility in mind

---

### 🔹 2. Robust Data Modeling & Persistence
- Designed normalized relational schema with clear entity relationships
- Implemented using JPA/Hibernate with optimized mappings
- Ensured consistency across booking, inventory, and payments

---

### 🔹 3. Hotel & Inventory Management APIs
- Developed APIs for:
    - Hotel onboarding & management
    - Room configuration
    - Inventory tracking per date range
- Supports real-world scenarios like partial availability & date overlaps

---

### 🔹 4. Search & Booking System (Concurrency-Safe)
- Implemented booking workflow with transactional guarantees
- Prevents double booking using proper locking and consistency mechanisms
- Designed for high-concurrency environments

---

### 🔹 5. Dynamic Pricing Engine (Design Patterns)
- Built flexible pricing system using Decorator Design Pattern
- Supports:
    - Surge pricing
    - Seasonal adjustments
    - Custom pricing strategies
- Easily extensible for future pricing rules

---

### 🔹 6. Authentication & Authorization
- Implemented JWT-based security
- Role-based access:
    - Guest
    - Manager
    - Admin
- Secured all critical endpoints with proper authorization checks

---

### 🔹 7. Payment Integration (Stripe)
- Integrated Stripe Payment Gateway for:
    - Secure payments
    - Refund handling
- Tested using Stripe test mode
- Designed payment flow aligned with booking lifecycle

---

### 🔹 8. API Documentation & Developer Experience
- Documented all APIs using Swagger (OpenAPI)
- Used Postman for iterative testing during development
- Ensured APIs are developer-friendly and self-explanatory

---

### 🔹 9. Clean Architecture & Code Quality
- Followed layered architecture:
    - Controller → Service → Repository
- Emphasized:
    - Clean code principles
    - Readability & maintainability
    - Separation of concerns

---

## 📊 Core Features

- ✅ User Roles (Guest, Manager, Admin)
- ✅ Hotel & Room Management
- ✅ Inventory-based Availability Tracking
- ✅ Concurrency-safe Booking System
- ✅ Dynamic Pricing Engine
- ✅ Secure JWT Authentication
- ✅ Stripe Payments & Refunds
- ✅ API Documentation via Swagger

---

## 🚧 Project Status

**Near production-ready** — core systems including booking, inventory management, dynamic pricing, authentication, and Stripe-based payments (with refunds) are fully implemented and tested.

Currently finalizing:
- Admin APIs for platform-level management and controls

Overall system is stable, feature-complete for core user flows, and designed with scalability and extensibility in mind.

---

## 💡 Key Learnings

- Designing real-world scalable backend systems
- Handling concurrency & transactional integrity
- Applying design patterns in production use-cases
- Building secure and extensible APIs
- Understanding end-to-end system design of booking platforms

---

## 🎯 Why This Project Matters

Yatrik is not just a CRUD project — it reflects:
- Strong backend fundamentals
- Practical system design thinking
- Ability to build production-like systems from scratch

---
Built by Vishvajit Jadhav

