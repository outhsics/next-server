import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import fs from 'fs';
import path from 'path';

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
                    process.env[key] = value.replace(/^["']|["']$/g, '');
                }
            }
        });
    }
} catch (e) {
    console.error('Error loading .env.local', e);
}

// Check key availability
const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!key) {
    console.error('No API Key found!');
    process.exit(1);
}

const modelsToTest = [
    'gemini-2.0-flash',
    'gemini-flash-latest'
];

async function test() {
    for (const modelName of modelsToTest) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const result = await generateText({
                model: google(modelName),
                prompt: 'One word answer: Hi',
            });
            console.log(`✅ SUCCESS with ${modelName}:`, result.text);
            return;
        } catch (e) {
            console.error(`❌ FAILED with ${modelName}:`, e.message);
        }
    }
}

test();
