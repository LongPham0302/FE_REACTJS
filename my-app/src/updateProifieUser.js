import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ErrorMessage from './component/error';
import { useNavigate } from 'react-router-dom';
import { UPDATE_USER_MUTATION } from './graphql/mutations'
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { GET_USER } from './graphql/query';

function UpdateUser() {
    const [selectedDate, setSelectedDate] = useState('');
    const [name, setName] = useState('');
    const [dateOfBirth, setdateOfBirth] = useState('');
    const [description, setDescription] = useState('');
    const [avatarExternalUrl, setAvatarExternalUrl] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [hasError, setHasError] = useState(false);
    const id = localStorage.getItem('userId');
    const { data } = useQuery(GET_USER, {
        variables: { userId: id },
        skip: !id,
    });
    useEffect(() => {
        if (data) {
            setName(data.getUser.name);
            setAvatarExternalUrl(data.getUser.avatarExternalUrl);
            setDescription(data.getUser.description);
            setdateOfBirth(data.getUser.dateOfBirth);
            setSelectedDate(new Date(data.getUser.dateOfBirth))
        }
    }, [data]);
    const handleDateChange = (date) => {
        const dateFormat = moment(date).format('YYYY/MM/DD')
        setdateOfBirth(dateFormat)
        setSelectedDate(date);
    };
    const [updateUserMutation, { loading }] = useMutation(UPDATE_USER_MUTATION);
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
    const validate = () => {
        const validationErrors = {};
        if (description.length > 128) {
            validationErrors.description = 'description length less than 128'
        }
        return Object.keys(validationErrors).length === 0;
    };
    if (loading) return
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (isValid) {
            try {
                setHasError(false)
                const response = await updateUserMutation({
                    variables: {
                        updateUser: {
                            _id: id,
                            name,
                            avatarExternalUrl,
                            description,
                            dateOfBirth
                        }
                    }
                })
                if (response) {
                    localStorage.setItem("updateUser", true)
                    navigate('/profile');
                }
            } catch (error) {
                if (error.message === "Response not successful: Received status code 413") {
                    setErrors("Please select an image with a size < 50kb.")
                }
                else {
                    setErrors(error.message)
                }
                setHasError(true)
            }

        }

    }
    return (
        <div>
            {data && <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        UpdateUser
                    </h2>
                </div>
                {hasError && <ErrorMessage message={errors} />}
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
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
                                Update User
                            </button>
                        </div>
                    </form>
                </div>
            </div>}
        </div>
    )
}

export default UpdateUser