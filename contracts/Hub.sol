// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract Hub {
  event NoteCreated(
    uint256 indexed noteId,
    address indexed owner,
    bytes32 contentId
  );
  event ContentAdded(bytes32 indexed contentId, string contentUri);
  event ContentUpdated(bytes32 indexed contentId, string contentUri);

  struct Note {
    uint256 noteId;
    address owner;
    bytes32 contentId;
  }

  mapping(address => mapping(uint256 => Note)) private noteRegistry;
  mapping(bytes32 => string) private contentRegistry;
  mapping(address => uint256) private addressToNumberOfNotes;

  function createNote(
    string calldata _contentUri
  ) external {
    address _owner = msg.sender;
    bytes32 _contentId = keccak256(abi.encode(_contentUri));
    uint256 _noteId = addressToNumberOfNotes[_owner] + 1;

    addressToNumberOfNotes[_owner] = _noteId;
    noteRegistry[_owner][_noteId] = Note(
      _noteId,
      _owner,
      _contentId
    );
    contentRegistry[_contentId] = _contentUri;

    emit ContentAdded(_contentId, _contentUri);
    emit NoteCreated(_noteId, _owner, _contentId);
  }

  function updateNote(uint256 _noteId, string calldata _contentUri) external {
    address _owner = msg.sender;
    bytes32 _contentId = keccak256(abi.encode(_contentUri));

    noteRegistry[_owner][_noteId] = Note(
      _noteId,
      _owner,
      _contentId
    );
    contentRegistry[_contentId] = _contentUri;

    emit ContentAdded(_contentId, _contentUri);
  }

  function getContent(bytes32 _contentId) public view returns (string memory) {
    return contentRegistry[_contentId];
  }

  function getNote(uint256 _noteId) public view returns (Note memory) {
    address _owner = msg.sender;

    Note memory note = noteRegistry[_owner][_noteId];

    return note;
  }

  function getNotes() public view returns (Note[] memory) {
    address _owner = msg.sender;
    uint256 totalNotes = addressToNumberOfNotes[_owner];
    
    Note[] memory notes = new Note[](totalNotes);

    for (uint256 i = 0; i < totalNotes; i++) {
      Note storage currentNote = noteRegistry[_owner][i + 1];
      notes[i] = currentNote;
    }

    return notes;
  }
}
