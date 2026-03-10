import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      console.error(error);
      setError(error.message || "Login failed.");
      return;
    }
    if (data?.user) {
      onLogin(data.user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="bg-[#100d25] p-8 rounded-2xl shadow-xl border border-[#232323] w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-secondary text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#151030] border border-[#232323] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00cea8] transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-secondary text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#151030] border border-[#232323] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00cea8] transition-colors"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00cea8] hover:bg-[#00b894] disabled:bg-gray-600 disabled:cursor-not-allowed text-[#050816] font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
