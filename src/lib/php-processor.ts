
// This is a simplified simulation of PHP processing
// In a real app, this would connect to a backend service

export async function processPhpCode(phpCode: string): Promise<string> {
  try {
    // Extract the PHP part and non-PHP parts
    const htmlOutput = simulatePhpExecution(phpCode);
    
    // The full output is now directly what's returned from PHP processing
    // since all CSS and JS are already embedded in the PHP file
    return htmlOutput;
  } catch (error: any) {
    throw new Error(`PHP processing error: ${error.message}`);
  }
}

function simulatePhpExecution(phpCode: string): string {
  try {
    // Start with a complete HTML document
    let output = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
    `;
    
    // Process PHP echo statements
    const echoPattern = /echo\s+['"](.+?)['"];/g;
    let match;
    
    // Process echo statements that contain style tags
    let fullPhpCode = phpCode;
    const styleTagPattern = /echo\s+['"](<style[\s\S]*?<\/style>)['"]\s*;/g;
    let styleMatch;
    
    while ((styleMatch = styleTagPattern.exec(phpCode)) !== null) {
      output += styleMatch[1]; // Add the style tag directly to output
      // Remove the processed style tag from fullPhpCode to avoid duplicate processing
      fullPhpCode = fullPhpCode.replace(styleMatch[0], '');
    }
    
    // Process regular echo statements
    while ((match = echoPattern.exec(fullPhpCode)) !== null) {
      output += match[1];
    }
    
    // Process PHP variables within HTML/CSS/JS sections
    // This is a simplified simulation
    const phpPattern = /\$(\w+)/g;
    const variables: { [key: string]: string } = {};
    
    // Extract variable definitions
    const varPattern = /\$(\w+)\s*=\s*['"](.+?)['"];/g;
    let varMatch;
    while ((varMatch = varPattern.exec(phpCode)) !== null) {
      variables[varMatch[1]] = varMatch[2];
    }
    
    // Extract HTML parts (content outside PHP tags)
    const htmlParts = phpCode.split(/(<\?php|\?>)/g);
    for (let i = 0; i < htmlParts.length; i++) {
      const part = htmlParts[i];
      
      // If this is HTML (not PHP tag or PHP code block)
      if (part !== '<?php' && part !== '?>' && !htmlParts[i-1]?.includes('<?php')) {
        // Replace PHP variables in HTML
        let processedPart = part;
        const variableMatches = part.match(/\$(\w+)/g);
        if (variableMatches) {
          for (const match of variableMatches) {
            const varName = match.substring(1); // Remove $ prefix
            if (variables[varName]) {
              processedPart = processedPart.replace(match, variables[varName]);
            }
          }
        }
        output += processedPart;
      }
    }
    
    // Complete the HTML document
    output += `
        </body>
      </html>
    `;
    
    return output;
  } catch (error) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body>
          <div class="error-message">Error executing PHP: ${error}</div>
        </body>
      </html>
    `;
  }
}

// Function to check if PHP code contains syntax errors
export function checkPhpSyntax(phpCode: string): { valid: boolean, error?: string } {
  // This is a simplified check - a real implementation would validate actual PHP syntax
  const commonErrors = [
    { pattern: /echo\s+[^'"$]/, message: "Echo statement missing quotes" },
    { pattern: /\w+\s*\(\s*[^)]*$/, message: "Unclosed function parenthesis" },
    { pattern: /if\s*\([^)]*$/, message: "Unclosed if statement" },
    { pattern: /\$\w+\s*=\s*[^;]*$/, message: "Missing semicolon" }
  ];
  
  for (const error of commonErrors) {
    if (error.pattern.test(phpCode)) {
      return { valid: false, error: error.message };
    }
  }
  
  return { valid: true };
}
