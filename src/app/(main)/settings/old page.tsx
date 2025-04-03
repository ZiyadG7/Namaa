// 'use client'

// import { useState } from "react";

// export default function ProfilePage() {
//   const [formData, setFormData] = useState({
//     name: "Mohammed",
//     username: "Mohammed",
//     email: "email@gmail.com",
//     password: "********",
//     dob: "2000-01-25",
//     presentAddress: "Saudi Arabia",
//     permanentAddress: "Saudi Arabia",
//     city: "Alahsa",
//     postalCode: "31982",
//     country: "KSA",
//     profileImage: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setFormData({ ...formData, profileImage: event.target?.result as string });
//       };
//       reader.readAsDataURL(e.target.files[0]);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
//         {/* Tabs */}
//         <div className="flex border-b pb-2">
//           <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-2 px-4">
//             Edit Profile
//           </button>
//           <button className="text-gray-500 px-4">Preferences</button>
//         </div>

//         {/* Profile Image */}
//         <div className="flex flex-col items-center my-4">
//           <label htmlFor="imageUpload" className="relative cursor-pointer">
//             <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
//               {formData.profileImage ? (
//                 <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-gray-500">+</div>
//               )}
//             </div>
//             <input type="file" id="imageUpload" className="hidden" accept="image/*" onChange={handleImageUpload} />
//           </label>
//         </div>

//         {/* Form */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="text-sm text-gray-600">Your Name</label>
//             <input type="text" name="name" value={formData.name} onChange={handleChange}
//               className="w-full p-2 border rounded mt-1" />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600">User Name</label>
//             <input type="text" name="username" value={formData.username} onChange={handleChange}
//               className="w-full p-2 border rounded mt-1" />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600">Email</label>
//             <input type="email" name="email" value={formData.email} onChange={handleChange}
//               className="w-full p-2 border rounded mt-1" />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600">Password</label>
//             <input type="password" name="password" value={formData.password} onChange={handleChange}
//               className="w-full p-2 border rounded mt-1" />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600">Date of Birth</label>
//             <input type="date" name="dob" value={formData.dob} onChange={handleChange}
//               className="w-full p-2 border rounded mt-1" />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600">Present Address</label>
//             <input type="text" name="presentAddress" value={formData.presentAddress} onChange={handleChange}
//               className="w-full p-2 border rounded mt-1" />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600">Permanent Address</label>
//             <input type="text" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange}
//               className="w-full p-2 border rounded mt-1" />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600">City</label>
//             <input type="text" name="city" value={formData.city} onChange={handleChange}
//               className="w-full p-2 border rounded mt-1" />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600">Postal Code</label>
//             <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange}
//               className="w-full p-2 border rounded mt-1" />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600">Country</label>
//             <input type="text" name="country" value={formData.country} onChange={handleChange}
//               className="w-full p-2 border rounded mt-1" />
//           </div>
//         </div>

//         {/* Save Button */}
//         <div className="mt-6 flex justify-end">
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">Save</button>
//         </div>
//       </div>
//     </div>
//   );
// }
