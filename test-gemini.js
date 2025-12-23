const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
const fs = require('fs');
const path = require('path');

// Load env
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        console.log('Loading .env.local...');
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim();
                if (key && !key.startsWith('#')) {
                    process.env[key] = value.replace(/^["']|["']$/g, ''); // simple quote removal
                }
            }
        });
    } else {
        console.log('.env.local not found');
    }
} catch (e) {
    console.error('Error loading .env.local', e);
}

// Log loaded key (partially)
const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (key) {
    console.log(`Key found: ${key.substring(0, 5)}...`);
} else {
    console.error('GOOGLE_GENERATIVE_AI_API_KEY not found in process.env');
    process.exit(1);
}

async function test() {
    try {
        console.log('Attempting to call Gemini API...');
        const result = await generateText({
            model: google('gemini-1.5-flash'),
            prompt: 'Say hello!',
        });
        console.log('Success! Response:', result.text);
    } catch (e) {
        console.error('API Call Failed:', e);

        if (e.cause) {
            console.error('Cause:', e.cause);
        }
    }
}

test();
