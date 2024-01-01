import moment from 'moment';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../src/graphql/mutations';
import ErrorMessage from './component/error';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [selectedDate, setSelectedDate] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [dateOfBirth, setdateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [description, setDescription] = useState('');
    const [avatarExternalUrl, setAvatarExternalUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [signupMutation, { loading, error, data }] = useMutation(SIGNUP_MUTATION);
    console.log(loading, error, data);
    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();
    const id = localStorage.getItem('userId');
    useEffect(() => {
        if (id) {
            navigate('/profile');
        }
    }, [id, navigate]);
    const handleDateChange = (date) => {
        const dateFormat = moment(date).format('YYYY/MM/DD')
        setdateOfBirth(dateFormat)
        setSelectedDate(date);
    };
    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }
    const setAvatar = async (files) => {
        const file = files.target.files[0];
        if (file) {
            try {
                const base64String = await convertImageToBase64(file);
                setAvatarExternalUrl(base64String)
            } catch (error) {
                console.error('Error converting image to base64:', error);
            }
        }
    }
    const normalizeString = (str) => str.toLowerCase().replace(/\s/g, '');
    const areStringsEqual = (str1, str2) => normalizeString(str1) === normalizeString(str2);
    const validate = () => {
        const validationErrors = {};
        if (!email) {
            validationErrors.email = 'Email is required';
        } else if (!isValidEmail(email)) {
            validationErrors.email = 'Invalid email format';
        }
        if (!areStringsEqual(password, confirmPassword)) {
            validationErrors.password = 'Passwords do not match';
            validationErrors.confirmPassword = 'Passwords do not match';
        }
        if (description.length > 128) {
            validationErrors.description = 'description length less than 128'
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
                const response = await signupMutation({
                    variables: {
                        registerInput: {
                            email,
                            name,
                            password,
                            description,
                            avatarExternalUrl,
                            dateOfBirth
                        }
                    }
                })
                if (response.data.signup.status === 200) {
                    navigate('/login');
                }
            } catch (error) {
                setErrors(error.message)
                setHasError(true)
            }

        }
    };
    const navigateToLogin = () => {
        navigate('/login')
    }
    return (
        <div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                {hasError && <ErrorMessage message={errors} />}
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(normalizeString(e.target.value))}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {errors.email && <p className="text-red-500">{errors.email}</p>}

                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.password ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.password && <p className="text-red-500">{errors.password}</p>}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirm Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.confirmPassword ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Description
                                </label>
                            </div>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none ${errors.description ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.description && <p className="text-red-500">{errors.description}</p>}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Avatar
                                </label>
                            </div>
                            <div className="mt-2">
                                <input type="file" accept="image/*" onChange={setAvatar} />

                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Date Of Birth
                                </label>
                            </div>
                            <div className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    isClearable
                                    placeholderText="Select a date"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Do you have an account?{' '}
                        <button className='text-white p-1 rounded-md bg-indigo-600' onClick={navigateToLogin}>Login</button>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default SignUp