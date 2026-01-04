import { supabase } from '../config/supabase';

export interface DevUserProfile {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    is_admin: boolean;
    is_blocked: boolean;
}

export const isLocalhost = (): boolean => {
    return (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '[::1]'
    );
};

// Dev user credentials
const DEV_ADMIN_EMAIL = 'admin@localhost.dev';
const DEV_USER_EMAIL = 'user@localhost.dev';
const DEV_PASSWORD = 'DevPassword123!'; // Strong password for dev accounts

/**
 * Register or login a dev user in Supabase
 * This creates a real user in the database for testing
 */
export const devLogin = async (mode: 'admin' | 'user'): Promise<{ success: boolean; error?: string }> => {
    if (!isLocalhost()) {
        return { success: false, error: 'Dev login only works on localhost' };
    }

    try {
        const email = mode === 'admin' ? DEV_ADMIN_EMAIL : DEV_USER_EMAIL;
        const firstName = mode === 'admin' ? 'Dev' : 'Regular';
        const lastName = mode === 'admin' ? 'Admin' : 'User';

        console.log(`🔧 Attempting dev login as ${mode}...`);

        // Try to sign in first
        let signInResult = await supabase.auth.signInWithPassword({
            email,
            password: DEV_PASSWORD,
        });

        // If user doesn't exist, create them
        if (signInResult.error?.message?.includes('Invalid login credentials')) {
            console.log(`🔧 Dev user doesn't exist, creating new ${mode} account...`);

            const signUpResult = await supabase.auth.signUp({
                email,
                password: DEV_PASSWORD,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    },
                    emailRedirectTo: window.location.origin,
                },
            });

            if (signUpResult.error) {
                console.error('Failed to create dev user:', signUpResult.error);
                return { success: false, error: signUpResult.error.message };
            }

            // After signup, sign in
            signInResult = await supabase.auth.signInWithPassword({
                email,
                password: DEV_PASSWORD,
            });

            if (signInResult.error) {
                console.error('Failed to sign in after signup:', signInResult.error);
                return { success: false, error: signInResult.error.message };
            }

            // Create/update user profile with admin flag
            if (signInResult.data.user) {
                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .upsert({
                        id: signInResult.data.user.id,
                        email: email,
                        first_name: firstName,
                        last_name: lastName,
                        avatar_url: null,
                        is_admin: mode === 'admin',
                        is_blocked: false,
                    });

                if (profileError) {
                    console.error('Failed to create user profile:', profileError);
                    // Don't fail completely, user is still logged in
                } else {
                    console.log(`✅ Dev ${mode} profile created successfully`);
                }
            }
        } else if (signInResult.error) {
            console.error('Sign in error:', signInResult.error);
            return { success: false, error: signInResult.error.message };
        } else {
            // Successfully signed in, ensure profile has correct admin flag
            console.log(`✅ Dev ${mode} signed in successfully`);

            if (signInResult.data.user) {
                const { error: updateError } = await supabase
                    .from('user_profiles')
                    .upsert({
                        id: signInResult.data.user.id,
                        email: email,
                        first_name: firstName,
                        last_name: lastName,
                        is_admin: mode === 'admin',
                        is_blocked: false,
                    }, {
                        onConflict: 'id'
                    });

                if (updateError) {
                    console.warn('Could not update user profile:', updateError);
                }
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Dev login error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

/**
 * Sign out and clear any dev auth state
 */
export const devLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
};
