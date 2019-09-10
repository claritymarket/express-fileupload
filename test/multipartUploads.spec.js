'use strict';

const fs = require('fs');
const md5 = require('md5');
const path = require('path');
const request = require('supertest');
const server = require('./server');
const clearUploadsDir = server.clearUploadsDir;
const fileDir = server.fileDir;
const uploadDir = server.uploadDir;

const mockFiles = ['car.png', 'tree.png', 'basketball.png'];

let mockUser = {
  firstName: 'Joe',
  lastName: 'Schmo',
  email: 'joe@mailinator.com'
};

// Reset response body.uploadDir/uploadPath for testing.
const resetBodyUploadData = (res) => {
  res.body.uploadDir = '';
  res.body.uploadPath = '';
};

const genUploadResult = (fileName, filePath) => {
  const fileStat = fs.statSync(filePath);
  const fileBuffer = fs.readFileSync(filePath);
  return {
    name: fileName,
    md5: md5(fileBuffer),
    size: fileStat.size,
    uploadDir: '',
    uploadPath: ''
  };
};

describe('Test Directory Cleaning Method', function() {
  it('emptied "uploads" directory', function(done) {
    clearUploadsDir();
    const filesFound = fs.readdirSync(uploadDir).length;
    done(filesFound ? `Directory not empty. Found ${filesFound} files.` : null);
  });
});

describe('Test Single File Upload', function() {
  const app = server.setup();

  mockFiles.forEach((fileName) => {
    const filePath = path.join(fileDir, fileName);
    const uploadedFilePath = path.join(uploadDir, fileName);
    const result = genUploadResult(fileName, filePath);

    it(`upload ${fileName} with POST`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single')
        .attach('testFile', filePath)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });

    it(`upload ${fileName} with PUT`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single')
        .attach('testFile', filePath)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });    
  });

  it('fail when no files were attached', function(done) {
    request(app)
      .post('/upload/single')
      .expect(400)
      .end(done);
  });

  it('fail when using GET', function(done) {
    request(app)
      .get('/upload/single')
      .attach('testFile', path.join(fileDir, mockFiles[0]))
      .expect(400)
      .end(done);
  });

  it('fail when using HEAD', function(done) {
    request(app)
      .head('/upload/single')
      .attach('testFile', path.join(fileDir, mockFiles[0]))
      .expect(400)
      .end(done);
  });
});

describe('Test Single File Upload w/ .mv()', function() {
  const app = server.setup();

  mockFiles.forEach((fileName) => {
    const filePath = path.join(fileDir, fileName);
    const uploadedFilePath = path.join(uploadDir, fileName);
    const result = genUploadResult(fileName, filePath);

    it(`upload ${fileName} with POST w/ .mv()`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single')
        .attach('testFile', filePath)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });

    it(`upload ${fileName} with PUT w/ .mv()`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single')
        .attach('testFile', filePath)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });
  });
});

describe('Test Single File Upload with useTempFiles option.', function() {
  const app = server.setup({ useTempFiles: true, tempFileDir: '/tmp/' });

  mockFiles.forEach((fileName) => {
    const filePath = path.join(fileDir, fileName);
    const uploadedFilePath = path.join(uploadDir, fileName);
    const result = genUploadResult(fileName, filePath);
    
    it(`upload ${fileName} with POST`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single')
        .attach('testFile', filePath)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });

    it(`upload ${fileName} with PUT`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single')
        .attach('testFile', filePath)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });    
  });

  it('fail when no files were attached', function(done) {
    request(app)
      .post('/upload/single')
      .expect(400)
      .end(done);
  });

  it('fail when using GET', function(done) {
    request(app)
      .get('/upload/single')
      .attach('testFile', path.join(fileDir, mockFiles[0]))
      .expect(400)
      .end(done);
  });

  it('fail when using HEAD', function(done) {
    request(app)
      .head('/upload/single')
      .attach('testFile', path.join(fileDir, mockFiles[0]))
      .expect(400)
      .end(done);
  });
});

describe('Test Single File Upload with useTempFiles option and empty tempFileDir.', function() {
  const app = server.setup({ useTempFiles: true, tempFileDir: '' });

  mockFiles.forEach((fileName) => {
    const filePath = path.join(fileDir, fileName);
    const uploadedFilePath = path.join(uploadDir, fileName);
    const result = genUploadResult(fileName, filePath);

    it(`upload ${fileName} with POST`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single')
        .attach('testFile', filePath)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });    
  });
});

describe('Test Single File Upload w/ .mv() Promise', function() {
  const app = server.setup();

  mockFiles.forEach((fileName) => {
    const filePath = path.join(fileDir, fileName);
    const uploadedFilePath = path.join(uploadDir, fileName);
    const result = genUploadResult(fileName, filePath);
    
    it(`upload ${fileName} with POST w/ .mv() Promise`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single/promise')
        .attach('testFile', filePath)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });

    it(`upload ${fileName} with PUT w/ .mv() Promise`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single/promise')
        .attach('testFile', filePath)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });    
  });

  it('fail when no files were attached', function(done) {
    request(app)
      .post('/upload/single')
      .expect(400)
      .end(done);
  });

  it('fail when using GET', function(done) {
    request(app)
      .get('/upload/single')
      .attach('testFile', path.join(fileDir, mockFiles[0]))
      .expect(400)
      .end(done);
  });

  it('fail when using HEAD', function(done) {
    request(app)
      .head('/upload/single')
      .attach('testFile', path.join(fileDir, mockFiles[0]))
      .expect(400)
      .end(done);
  });
});

describe('Test Single File Upload w/ .mv() Promise and useTempFiles set to true', function() {
  const app = server.setup({ useTempFiles: true, tempFileDir: '/tmp/' });

  mockFiles.forEach((fileName) => {
    const filePath = path.join(fileDir, fileName);
    const uploadedFilePath = path.join(uploadDir, fileName);
    const result = genUploadResult(fileName, filePath);
    
    it(`upload ${fileName} with POST w/ .mv() Promise`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single/promise')
        .attach('testFile', filePath)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });

    it(`upload ${fileName} with PUT w/ .mv() Promise`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single/promise')
        .attach('testFile', filePath)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });    
  });

  it('fail when no files were attached', function(done) {
    request(app)
      .post('/upload/single')
      .expect(400)
      .end(done);
  });

  it('fail when using GET', function(done) {
    request(app)
      .get('/upload/single')
      .attach('testFile', path.join(fileDir, mockFiles[0]))
      .expect(400)
      .end(done);
  });

  it('fail when using HEAD', function(done) {
    request(app)
      .head('/upload/single')
      .attach('testFile', path.join(fileDir, mockFiles[0]))
      .expect(400)
      .end(done);
  });
});

describe('Test Multi-File Upload', function() {
  const app = server.setup();

  it('upload multiple files with POST', function(done) {
    clearUploadsDir();
    const req = request(app).post('/upload/multiple');
    let expectedResult = [];
    let expectedResultSorted = [];
    let uploadedFilesPath = [];
    mockFiles.forEach((fileName, index) => {
      let filePath = path.join(fileDir, fileName);
      let fileStat = fs.statSync(filePath);
      uploadedFilesPath.push(path.join(uploadDir, fileName));
      expectedResult.push({
        name: fileName,
        md5: md5(fs.readFileSync(filePath)),
        size: fileStat.size,
        uploadDir: '',
        uploadPath: ''
      });
      req.attach(`testFile${index+1}`, filePath);
    });

    req
      .expect((res) => {
        res.body.forEach(fileInfo => {
          fileInfo.uploadDir = '';
          fileInfo.uploadPath = '';
          let index = mockFiles.indexOf(fileInfo.name);
          expectedResultSorted.push(expectedResult[index]);
        });
      })
      .expect(200, expectedResultSorted)
      .end((err) => {
        if (err) return done(err);
        fs.stat(uploadedFilesPath[0], (err) => {
          if (err) return done(err);
          fs.stat(uploadedFilesPath[1], function(err) {
            if (err) return done(err);
            fs.stat(uploadedFilesPath[2], done);
          });
        });
      });
  });
});

describe('Test File Array Upload', function() {
  const app = server.setup();

  it('upload array of files with POST', function(done) {
    clearUploadsDir();
    const req = request(app).post('/upload/array');
    let expectedResult = [];
    let expectedResultSorted = [];
    let uploadedFilesPath = [];
    mockFiles.forEach((fileName) => {
      let filePath = path.join(fileDir, fileName);
      let fileStat = fs.statSync(filePath);
      uploadedFilesPath.push(path.join(uploadDir, fileName));
      expectedResult.push({
        name:fileName,
        md5: md5(fs.readFileSync(filePath)),
        size: fileStat.size,
        uploadDir: '',
        uploadPath: ''
      });
      req.attach('testFiles', filePath);
    });

    req
      .expect((res)=>{
        res.body.forEach(fileInfo => {
          fileInfo.uploadDir = '';
          fileInfo.uploadPath = '';
          let index = mockFiles.indexOf(fileInfo.name);
          expectedResultSorted.push(expectedResult[index]);
        });
      })
      .expect(200, expectedResultSorted)
      .end((err) => {
        if (err) return done(err);
        uploadedFilesPath.forEach((uploadedFilePath) => {
          fs.statSync(uploadedFilePath);
        });
        done();
      });
  });
});

describe('Test Upload With Fields', function() {
  const app = server.setup();
  mockFiles.forEach((fileName) => {
    const filePath = path.join(fileDir, fileName);
    const uploadedFilePath = path.join(uploadDir, fileName);
    // Expected results
    const result = genUploadResult(fileName, filePath);
    result.firstName = mockUser.firstName;
    result.lastName = mockUser.lastName;
    result.email = mockUser.email;

    it(`upload ${fileName} and submit fields at the same time with POST`, function(done) {
      clearUploadsDir();
      request(app)
        .post('/upload/single/withfields')
        .attach('testFile', filePath)
        .field('firstName', mockUser.firstName)
        .field('lastName', mockUser.lastName)
        .field('email', mockUser.email)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });

    it(`upload ${fileName} and submit fields at the same time with PUT`, function(done) {
      clearUploadsDir();
      request(app)
        .put('/upload/single/withfields')
        .attach('testFile', filePath)
        .field('firstName', mockUser.firstName)
        .field('lastName', mockUser.lastName)
        .field('email', mockUser.email)
        .expect(resetBodyUploadData)
        .expect(200, result, err => (err ? done(err) : fs.stat(uploadedFilePath, done)));
    });    
  });
});
