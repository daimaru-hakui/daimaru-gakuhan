import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase';

const StudentShowId = () => {
  const router = useRouter();
  const [student, setStudent] = useState<any>();
  console.log(student);
  useEffect(() => {
    const getStudent = async () => {
      const studentRef = doc(
        db,
        'schools',
        `${router.query.projectId}`,
        'students',
        `${router.query.id}`
      );
      const docSnap = await getDoc(studentRef);
      setStudent(docSnap.data());
    };
    getStudent();
  }, [router.query.id, router.query.projectId]);
  return <div>ShowId</div>;
};

export default StudentShowId;
