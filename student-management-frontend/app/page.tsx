"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import {
  Trash2,
  Edit,
  Plus,
  X,
  Search,
  UserCircle,
  LogOut,
} from "lucide-react";

// Types
interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
}

interface StudentFormData {
  name: string;
  email: string;
  age: string;
}

export default function Home() {
  const router = useRouter();
  const { user, token, logout, isAuthenticated } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    email: "",
    age: "",
  });

  const API_URL = "http://localhost:8080/api/students";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch all students
  const fetchStudents = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(
        "Failed to load students. Make sure the backend is running on port 8080."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchStudents();
    }
  }, [isAuthenticated, token]);

  // Create student
  const createStudent = async (studentData: StudentFormData) => {
    if (!token) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: studentData.name,
          email: studentData.email,
          age: parseInt(studentData.age),
        }),
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to create student");
      await fetchStudents();
      closeModal();
    } catch (err) {
      setError("Failed to create student");
      console.error(err);
    }
  };

  // Update student
  const updateStudent = async (id: number, studentData: StudentFormData) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: studentData.name,
          email: studentData.email,
          age: parseInt(studentData.age),
        }),
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to update student");
      await fetchStudents();
      closeModal();
    } catch (err) {
      setError("Failed to update student");
      console.error(err);
    }
  };

  // Delete student
  const deleteStudent = async (id: number) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to delete student");
      await fetchStudents();
    } catch (err) {
      setError("Failed to delete student");
      console.error(err);
    }
  };

  // Modal handlers
  const openModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        age: student.age.toString(),
      });
    } else {
      setEditingStudent(null);
      setFormData({ name: "", email: "", age: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({ name: "", email: "", age: "" });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.age) {
      alert("Please fill in all fields");
      return;
    }
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      createStudent(formData);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Filter students by search term
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Student Management System
              </h1>
              <p className="text-gray-600">
                Welcome,{" "}
                <span className="font-semibold text-indigo-600">
                  {user?.fullName || user?.username}
                </span>
                !
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Add Student
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No students found</p>
              <p className="text-gray-400 mt-2">
                Add your first student to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Age</th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-700">{student.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{student.age}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => openModal(student)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deleteStudent(student.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Total Count */}
        <div className="mt-6 text-center text-gray-600">
          Total Students:{" "}
          <span className="font-semibold text-indigo-600">
            {filteredStudents.length}
          </span>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingStudent ? "Edit Student" : "Add New Student"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter student name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter age"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  {editingStudent ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
