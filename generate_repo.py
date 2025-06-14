import os
import sys
from transformers import pipeline

def main():
    prompt = ' '.join(sys.argv[1:]) if len(sys.argv) > 1 else input('Describe your tool: ')
    model_name = 'gpt2'
    pipe = pipeline('text-generation', model=model_name, tokenizer=model_name, max_new_tokens=100)
    generated = pipe(prompt, num_return_sequences=1)[0]['generated_text']

    repo_name = '-'.join(prompt.lower().split()[:5]) or 'generated-repo'
    os.makedirs(repo_name, exist_ok=True)
    with open(os.path.join(repo_name, 'README.md'), 'w') as f:
        f.write(f'# {repo_name}\n\nGenerated from prompt: {prompt}\n')
    with open(os.path.join(repo_name, 'main.py'), 'w') as f:
        f.write(generated)

    print(f'Repository files created in ./{repo_name}')
    print('To publish on GitHub:')
    print(f'  cd {repo_name}')
    print('  git init')
    print('  git add .')
    print("  git commit -m 'Initial commit'")
    print('  gh repo create --public --source=. --remote=origin --push')
    print('After that command finishes, you will see a link to your new repository.')

if __name__ == '__main__':
    main()
