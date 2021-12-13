
import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
export const About = (props) => {
    const { isAuth, authToken } = useSelector((state) => {
        return {
            isAuth: state.auth.isAuth,
            authToken: state.auth.authToken
        }
    }, shallowEqual)

    useEffect(() => {
    }, [])
    return (
        <div>
            About
            <div>
                isauth: {isAuth}
            </div>
            <div>
                {authToken}
            </div>

        </div>
    )
}