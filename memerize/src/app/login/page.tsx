const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 shadow-md rounded-lg">
                <h2 className="text-3xl font-bold text-center text-black">Login</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-black">
                        Email
                        </label>
                        <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-black text-black"
                        placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-black">
                        Password
                        </label>
                        <input
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-black text-black"
                        placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-black">
                        Don't have an account?{' '}
                        <a href="/register" className="text-blue-600 hover:underline font-bold">
                        Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
