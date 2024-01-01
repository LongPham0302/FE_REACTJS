import React, { useState } from 'react';
import { LOGIN_MUTATION } from '../src/graphql/mutations';
import ErrorMessage from './component/error';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [hasError, setHasError] = useState(false);
    const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);
    const normalizeString = (str) => str.toLowerCase().replace(/\s/g, '');
    const navigate = useNavigate();
    if (loading) {
        console.log("loading");
    }
    const validate = () => {
        const validationErrors = {};

        if (!email) {
            validationErrors.email = 'Email is required';
        } else if (!isValidEmail(email)) {
            validationErrors.email = 'Invalid email format';
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    const isValidEmail = (email) => {
        // Hàm kiểm tra định dạng email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Thực hiện validation trước khi submit
        const isValid = validate();
        if (isValid) {
            // Gửi dữ liệu lên server hoặc thực hiện các thao tác khác
            // ...
            try {
                setHasError(false)
                const response = await loginMutation({
                    variables: {
                        loginInput: {
                            email,
                            password,
                        }
                    }
                })
                if (response.data.login.status === 200) {
                    localStorage.setItem('key', response.data.login.token);
                    localStorage.setItem('userId', response.data.login.userId);

                    navigate('/profile');

                }
                // Lưu trữ dữ liệu

            } catch (error) {
                setErrors(error.message)
                setHasError(true)
                console.log("error", error);
            }

        }
    };
    const navigateToSignup  = () => {
        console.log(123);
        navigate('/signup')
    }
    return (
        <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div class="relative py-3 sm:max-w-xl sm:mx-auto">
                <div
                    class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                </div>
                {hasError && <ErrorMessage message={errors} />}
                <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div class="max-w-md mx-auto">
                        <div>
                            <h1 class="text-2xl font-semibold">Login Form with Floating Labels</h1>
                        </div>
                        <div class="divide-y divide-gray-200">
                            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div class="relative">
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autocomplete="off"
                                        id="email"
                                        name="email"
                                        type="text"
                                        class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />
                                    <label for="email" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
                                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                                </div>
                                <div class="relative">
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(normalizeString(e.target.value))}
                                        autocomplete="off" id="password" name="password" type="password" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
                                    <label for="password" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                                </div>
                                <div class='flex'>
                                    <div class="relative">
                                        <button class="bg-blue-500 text-white rounded-md px-2 py-1" onClick={handleSubmit}>Submit</button>
                                    </div>
                                    <div class="relative ml-5">
                                        <button class="bg-blue-500 text-white rounded-md px-2 py-1" onClick={navigateToSignup}>SignUp</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login