// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PromoterValidation
 * @dev Smart contract for immutable promoter validation audit trail
 * @author GeneChain Team
 */
contract PromoterValidation {
    
    // Events
    event ValidationLogged(
        bytes32 indexed sequenceHash,
        bytes32 indexed modelHash,
        string prediction,
        uint256 probability,
        uint256 timestamp,
        address indexed analyst
    );
    
    event ModelRegistered(
        bytes32 indexed modelHash,
        string modelName,
        string version,
        uint256 timestamp,
        address indexed registrar
    );
    
    event AccessGranted(
        address indexed user,
        bytes32 indexed patientId,
        uint256 timestamp
    );
    
    event AccessRevoked(
        address indexed user,
        bytes32 indexed patientId,
        uint256 timestamp
    );
    
    // Structs
    struct ValidationRecord {
        bytes32 sequenceHash;
        bytes32 modelHash;
        string prediction;
        uint256 probability;
        uint256 timestamp;
        address analyst;
        bool exists;
    }
    
    struct ModelInfo {
        string modelName;
        string version;
        uint256 registrationTime;
        address registrar;
        bool isActive;
    }
    
    struct AccessControl {
        mapping(address => bool) authorizedUsers;
        uint256 grantTime;
        address grantedBy;
    }
    
    // State variables
    mapping(bytes32 => ValidationRecord) public validations;
    mapping(bytes32 => ModelInfo) public registeredModels;
    mapping(bytes32 => AccessControl) public patientAccess;
    
    address public owner;
    uint256 public totalValidations;
    uint256 public totalModels;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorized(bytes32 patientId) {
        require(
            patientAccess[patientId].authorizedUsers[msg.sender] || msg.sender == owner,
            "Not authorized to access this patient data"
        );
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        totalValidations = 0;
        totalModels = 0;
    }
    
    /**
     * @dev Log a promoter validation result to the blockchain
     * @param sequenceHash Hash of the DNA sequence
     * @param modelHash Hash of the ML model used
     * @param prediction Classification result (promoter/non-promoter)
     * @param probability Confidence score (0-10000, where 10000 = 100%)
     * @param patientId Hash of patient identifier
     */
    function logValidation(
        bytes32 sequenceHash,
        bytes32 modelHash,
        string memory prediction,
        uint256 probability,
        bytes32 patientId
    ) external onlyAuthorized(patientId) {
        require(sequenceHash != bytes32(0), "Invalid sequence hash");
        require(modelHash != bytes32(0), "Invalid model hash");
        require(probability <= 10000, "Probability must be <= 10000");
        require(registeredModels[modelHash].isActive, "Model not registered or inactive");
        
        // Create validation record
        ValidationRecord memory record = ValidationRecord({
            sequenceHash: sequenceHash,
            modelHash: modelHash,
            prediction: prediction,
            probability: probability,
            timestamp: block.timestamp,
            analyst: msg.sender,
            exists: true
        });
        
        // Store validation
        validations[sequenceHash] = record;
        totalValidations++;
        
        // Emit event
        emit ValidationLogged(
            sequenceHash,
            modelHash,
            prediction,
            probability,
            block.timestamp,
            msg.sender
        );
    }
    
    /**
     * @dev Register a new ML model
     * @param modelHash Hash of the model
     * @param modelName Name of the model
     * @param version Version string
     */
    function registerModel(
        bytes32 modelHash,
        string memory modelName,
        string memory version
    ) external onlyOwner {
        require(modelHash != bytes32(0), "Invalid model hash");
        require(!registeredModels[modelHash].isActive, "Model already registered");
        
        ModelInfo memory model = ModelInfo({
            modelName: modelName,
            version: version,
            registrationTime: block.timestamp,
            registrar: msg.sender,
            isActive: true
        });
        
        registeredModels[modelHash] = model;
        totalModels++;
        
        emit ModelRegistered(
            modelHash,
            modelName,
            version,
            block.timestamp,
            msg.sender
        );
    }
    
    /**
     * @dev Deactivate a registered model
     * @param modelHash Hash of the model to deactivate
     */
    function deactivateModel(bytes32 modelHash) external onlyOwner {
        require(registeredModels[modelHash].isActive, "Model not found or already inactive");
        
        registeredModels[modelHash].isActive = false;
        
        emit ModelRegistered(
            modelHash,
            registeredModels[modelHash].modelName,
            registeredModels[modelHash].version,
            block.timestamp,
            msg.sender
        );
    }
    
    /**
     * @dev Grant access to patient data
     * @param user Address of the user to grant access to
     * @param patientId Hash of patient identifier
     */
    function grantAccess(address user, bytes32 patientId) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(patientId != bytes32(0), "Invalid patient ID");
        
        patientAccess[patientId].authorizedUsers[user] = true;
        patientAccess[patientId].grantTime = block.timestamp;
        patientAccess[patientId].grantedBy = msg.sender;
        
        emit AccessGranted(user, patientId, block.timestamp);
    }
    
    /**
     * @dev Revoke access to patient data
     * @param user Address of the user to revoke access from
     * @param patientId Hash of patient identifier
     */
    function revokeAccess(address user, bytes32 patientId) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(patientId != bytes32(0), "Invalid patient ID");
        
        patientAccess[patientId].authorizedUsers[user] = false;
        
        emit AccessRevoked(user, patientId, block.timestamp);
    }
    
    /**
     * @dev Get validation record by sequence hash
     * @param sequenceHash Hash of the DNA sequence
     * @return Validation record details
     */
    function getValidation(bytes32 sequenceHash) external view returns (
        bytes32 modelHash,
        string memory prediction,
        uint256 probability,
        uint256 timestamp,
        address analyst
    ) {
        ValidationRecord memory record = validations[sequenceHash];
        require(record.exists, "Validation not found");
        
        return (
            record.modelHash,
            record.prediction,
            record.probability,
            record.timestamp,
            record.analyst
        );
    }
    
    /**
     * @dev Get model information
     * @param modelHash Hash of the model
     * @return Model information
     */
    function getModelInfo(bytes32 modelHash) external view returns (
        string memory modelName,
        string memory version,
        uint256 registrationTime,
        address registrar,
        bool isActive
    ) {
        ModelInfo memory model = registeredModels[modelHash];
        require(model.isActive, "Model not found or inactive");
        
        return (
            model.modelName,
            model.version,
            model.registrationTime,
            model.registrar,
            model.isActive
        );
    }
    
    /**
     * @dev Check if user has access to patient data
     * @param user Address of the user
     * @param patientId Hash of patient identifier
     * @return True if user has access
     */
    function hasAccess(address user, bytes32 patientId) external view returns (bool) {
        return patientAccess[patientId].authorizedUsers[user] || user == owner;
    }
    
    /**
     * @dev Get contract statistics
     * @return Total validations and models
     */
    function getStats() external view returns (uint256, uint256) {
        return (totalValidations, totalModels);
    }
    
    /**
     * @dev Transfer ownership
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }
    
    /**
     * @dev Emergency pause function (only owner)
     */
    function emergencyPause() external onlyOwner {
        // This could be expanded to include a pause mechanism
        // For now, it's a placeholder for emergency controls
        require(false, "Emergency pause activated");
    }
}


