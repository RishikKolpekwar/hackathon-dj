import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    ellipse at center,
    rgba(42, 138, 246, 0.1) 0%,
    rgba(17, 17, 17, 0.8) 70%,
    #111111 100%
  );
  overflow-y: auto;
  padding: 40px 20px;
`;

const FormWrapper = styled.div`
  max-width: 700px;
  width: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 20px;
  padding: 50px 60px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
              0 0 0 2px rgba(42, 138, 246, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(
      135deg,
      #e92a67 0%,
      #a853ba 33%,
      #2a8af6 66%,
      #e92a67 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.3;
    animation: pulse 2s ease-in-out infinite alternate;
  }
`;

const Title = styled.h1`
  font-family: 'Fira Mono', monospace;
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #e92a67 0%, #a853ba 50%, #2a8af6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 40px;
  font-family: 'Fira Mono', monospace;
`;

const FormGroup = styled.div`
  margin-bottom: 30px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: #f3f4f6;
  font-family: 'Fira Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  letter-spacing: -0.2px;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 16px 20px;
  background: rgba(17, 17, 17, 0.8);
  border: 2px solid rgba(42, 138, 246, 0.3);
  border-radius: 12px;
  color: #f3f4f6;
  font-family: 'Fira Mono', monospace;
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: rgba(42, 138, 246, 0.6);
    background: rgba(17, 17, 17, 0.95);
  }
  
  &:focus {
    outline: none;
    border-color: #2a8af6;
    box-shadow: 0 0 0 4px rgba(42, 138, 246, 0.1);
  }

  &::file-selector-button {
    background: linear-gradient(135deg, #e92a67 0%, #a853ba 50%, #2a8af6 100%);
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    font-family: 'Fira Mono', monospace;
    font-weight: 500;
    cursor: pointer;
    margin-right: 15px;
    transition: all 0.3s ease;
  }

  &::file-selector-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(42, 138, 246, 0.4);
  }
`;

const TimeInput = styled.input`
  width: 100%;
  padding: 16px 20px;
  background: rgba(17, 17, 17, 0.8);
  border: 2px solid rgba(168, 83, 186, 0.3);
  border-radius: 12px;
  color: #f3f4f6;
  font-family: 'Fira Mono', monospace;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #777;
  }
  
  &:hover {
    border-color: rgba(168, 83, 186, 0.6);
    background: rgba(17, 17, 17, 0.95);
  }
  
  &:focus {
    outline: none;
    border-color: #a853ba;
    box-shadow: 0 0 0 4px rgba(168, 83, 186, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 18px 20px;
  background: linear-gradient(135deg, #e92a67 0%, #a853ba 50%, #2a8af6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-family: 'Fira Mono', monospace;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  letter-spacing: -0.3px;
  box-shadow: 0 10px 30px rgba(42, 138, 246, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(42, 138, 246, 0.5);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FileName = styled.div`
  color: #2a8af6;
  font-size: 12px;
  margin-top: 8px;
  font-family: 'Fira Mono', monospace;
`;

function UploadForm() {
    const [formData, setFormData] = useState({
        song1: null,
        song2: null,
        transition: null,
        song1Time: '',
        song2Time: '',
    });

    const handleFileChange = (field) => (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            [field]: file
        }));
    };

    const handleTimeChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // TODO: Add your upload logic here
        alert('DJ Set uploaded successfully! 🎵');
    };

    const isFormValid = () => {
        return formData.song1 &&
            formData.song2 &&
            formData.transition &&
            formData.song1Time &&
            formData.song2Time;
    };

    return (
        <FormContainer>
            <FormWrapper>
                <Title>Get Paid to Upload Your DJ Sets</Title>
                <Subtitle>Share your transitions and earn from your creativity</Subtitle>

                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Song 1</Label>
                        <FileInput
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange('song1')}
                        />
                        {formData.song1 && (
                            <FileName>✓ {formData.song1.name}</FileName>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <Label>Song 2</Label>
                        <FileInput
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange('song2')}
                        />
                        {formData.song2 && (
                            <FileName>✓ {formData.song2.name}</FileName>
                        )}
                    </FormGroup>

                    <InputRow>
                        <FormGroup>
                            <Label>Song 1 Transition Start Time</Label>
                            <TimeInput
                                type="text"
                                placeholder="e.g., 1:30"
                                value={formData.song1Time}
                                onChange={handleTimeChange('song1Time')}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Song 2 Transition Start Time</Label>
                            <TimeInput
                                type="text"
                                placeholder="e.g., 0:15"
                                value={formData.song2Time}
                                onChange={handleTimeChange('song2Time')}
                            />
                        </FormGroup>
                    </InputRow>

                    <FormGroup>
                        <Label>Transition Audio</Label>
                        <FileInput
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange('transition')}
                        />
                        {formData.transition && (
                            <FileName>✓ {formData.transition.name}</FileName>
                        )}
                    </FormGroup>

                    <SubmitButton type="submit" disabled={!isFormValid()}>
                        Upload DJ Set
                    </SubmitButton>
                </form>
            </FormWrapper>
        </FormContainer>
    );
}

export default UploadForm;
