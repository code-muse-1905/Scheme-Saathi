// Calculates age in whole years from a date of birth, as of today.
function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  // If this year's birthday hasn't happened yet, subtract 1
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

// Checks a single array-based rule (states, occupation, category).
// "All" in the scheme's array means the rule is skipped (everyone passes).
function matchesArrayRule(schemeValues, userValue) {
  if (schemeValues.includes("All")) return true;
  return schemeValues.includes(userValue);
}

// Main function: does this profile satisfy this scheme's rules?
export function checkEligibility(profile, scheme) {
  const age = calculateAge(profile.dateOfBirth);
  const reasons = [];

  if (age < scheme.minAge || age > scheme.maxAge) {
    reasons.push(`Age ${age} not in range ${scheme.minAge}-${scheme.maxAge}`);
  }

  if (profile.income > scheme.maxIncome) {
    reasons.push(`Income ${profile.income} exceeds max ${scheme.maxIncome}`);
  }

  if (!matchesArrayRule(scheme.states, profile.state)) {
    reasons.push(`State ${profile.state} not eligible`);
  }

  if (!matchesArrayRule(scheme.occupation, profile.occupation)) {
    reasons.push(`Occupation ${profile.occupation} not eligible`);
  }

  if (!matchesArrayRule(scheme.category, profile.category)) {
    reasons.push(`Category ${profile.category} not eligible`);
  }

  if (scheme.disabilityRequired && !profile.disabilityStatus) {
    reasons.push("Disability status required but not met");
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}